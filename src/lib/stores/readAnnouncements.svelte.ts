import { browser } from '$app/environment';
import { PersistedState } from 'runed';
import { fetchLatestAnnouncementIds, fetchLatestAnnouncements } from '$api/client';
import type { Announcement, TaggedLatestAnnouncements } from '$api/types';

const STORAGE_KEY = 'read_announcements_latest_id';
const LEGACY_STORAGE_KEY = 'read_announcements';
const POLL_INTERVAL_MS = 2 * 60 * 1000;

function sortAnnouncements(announcements: Announcement[]): Announcement[] {
	return [...announcements].sort((left, right) => {
		const rightTime = new Date(right.created_at).getTime();
		const leftTime = new Date(left.created_at).getTime();

		if (rightTime !== leftTime) {
			return rightTime - leftTime;
		}

		return right.id - left.id;
	});
}

function getHighestAnnouncementId(announcements: Array<{ id: number }>): number {
	return announcements.reduce((highestId, announcement) => Math.max(highestId, announcement.id), 0);
}

function getLatestAnnouncement(
	latestAnnouncements: TaggedLatestAnnouncements[]
): Announcement | null {
	if (latestAnnouncements.length === 0) return null;

	return latestAnnouncements.reduce<Announcement | null>((latest, { announcement }) => {
		if (!latest || announcement.id > latest.id) {
			return announcement;
		}

		return latest;
	}, null);
}

function mergeLatestAnnouncements(
	announcements: Announcement[],
	latestAnnouncements: Announcement[]
): Announcement[] {
	const byId = new Map(announcements.map((announcement) => [announcement.id, announcement]));

	for (const announcement of latestAnnouncements) {
		byId.set(announcement.id, announcement);
	}

	return sortAnnouncements([...byId.values()]);
}

const latestReadId = new PersistedState<number>(STORAGE_KEY, 0, {
	serializer: {
		serialize: (value: number) => JSON.stringify(value),
		deserialize: (str: string) => {
			try {
				const parsed = JSON.parse(str);
				if (typeof parsed === 'number') {
					return parsed;
				}

				if (
					parsed &&
					typeof parsed === 'object' &&
					!Array.isArray(parsed) &&
					Object.values(parsed).every((id) => typeof id === 'number')
				) {
					const ids = Object.values(parsed).filter((id): id is number => typeof id === 'number');
					return getHighestAnnouncementId(ids.map((id) => ({ id })));
				}

				if (Array.isArray(parsed) && parsed.every((id) => typeof id === 'number')) {
					return getHighestAnnouncementId(parsed.map((id) => ({ id })));
				}

				return 0;
			} catch {
				return 0;
			}
		}
	}
});

const legacyReadIds = new PersistedState<number[]>(LEGACY_STORAGE_KEY, [], {
	serializer: {
		serialize: JSON.stringify,
		deserialize: (str: string) => {
			try {
				const parsed = JSON.parse(str);
				if (Array.isArray(parsed) && parsed.every((id) => typeof id === 'number')) {
					return parsed;
				}
			} catch {
				// ignore
			}
			return [];
		}
	}
});

let _announcements = $state<Announcement[]>([]);
let latestFetchedId = $state(0);
let pollingHandle = $state<ReturnType<typeof setInterval> | null>(null);
let pollInFlight = $state(false);

export const announcementPolling = {
	get data(): Announcement[] {
		return _announcements;
	},

	syncData(announcements: Announcement[]) {
		_announcements = sortAnnouncements(announcements);
		if (browser && announcements.length > 0) {
			readAnnouncements.migrateLegacyReads(announcements);
		}
	},

	start() {
		if (!browser || pollingHandle) return;

		void this.pollLatest();
		pollingHandle = setInterval(() => {
			void this.pollLatest();
		}, POLL_INTERVAL_MS);
	},

	stop() {
		if (!pollingHandle) return;

		clearInterval(pollingHandle);
		pollingHandle = null;
	},

	async pollLatest() {
		if (!browser || pollInFlight) return;

		pollInFlight = true;

		try {
			const latestIds = await fetchLatestAnnouncementIds();
			const latestId = getHighestAnnouncementId(latestIds);

			if (
				latestId === 0 ||
				readAnnouncements.hasSeenLatest(latestId) ||
				latestFetchedId >= latestId
			) {
				return;
			}

			const latestAnnouncements = await fetchLatestAnnouncements();
			const latestAnnouncement = getLatestAnnouncement(latestAnnouncements);
			if (!latestAnnouncement) return;

			latestFetchedId = latestAnnouncement.id;

			if (readAnnouncements.hasSeenLatest(latestAnnouncement.id)) return;

			_announcements = mergeLatestAnnouncements(_announcements, [latestAnnouncement]);
		} catch {
			// ignore polling failures; announcements already degrade gracefully elsewhere
		} finally {
			pollInFlight = false;
		}
	}
};

class ReadAnnouncementsTracker {
	get latestId(): number {
		return latestReadId.current;
	}

	get hasTrackedAnnouncements(): boolean {
		return latestReadId.current > 0;
	}

	hasSeenLatest(id: number) {
		return latestReadId.current >= id;
	}

	isRead(announcement: Announcement) {
		return latestReadId.current >= announcement.id;
	}

	markAsRead(announcement: Announcement) {
		latestReadId.current = Math.max(latestReadId.current, announcement.id);
	}

	markManyAsRead(announcements: Announcement[]) {
		latestReadId.current = Math.max(latestReadId.current, getHighestAnnouncementId(announcements));
	}

	markAsUnread(announcement: Announcement) {
		if (latestReadId.current === announcement.id) {
			latestReadId.current = Math.max(
				0,
				..._announcements.filter((item) => item.id < announcement.id).map((item) => item.id)
			);
		}
	}

	clearAll() {
		latestReadId.current = 0;
	}

	countUnread(announcements: Announcement[]) {
		return announcements.filter((announcement) => !this.isRead(announcement)).length;
	}

	migrateLegacyReads(currentAnnouncements: Announcement[]) {
		if (this.hasTrackedAnnouncements || legacyReadIds.current.length === 0) return;

		const legacyReadIdSet = new Set(legacyReadIds.current);
		const matchingAnnouncements = currentAnnouncements.filter((announcement) =>
			legacyReadIdSet.has(announcement.id)
		);

		if (matchingAnnouncements.length > 0) {
			this.markManyAsRead(matchingAnnouncements);
		}

		legacyReadIds.current = [];
	}
}

export const readAnnouncements = new ReadAnnouncementsTracker();
