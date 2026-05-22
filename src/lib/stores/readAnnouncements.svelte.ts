import { browser } from '$app/environment';
import { PersistedState } from 'runed';
import { LatestAnnouncementsSchema } from '$api/schemas';
import { composeApiUrl, getApiUrl } from '$api/settings';
import type { Announcement, TaggedLatestAnnouncements } from '$api/types';

const STORAGE_KEY = 'read_announcements_latest_id';
const LEGACY_STORAGE_KEY = 'read_announcements';

const DEFAULT_POLL_MS = 5 * 60 * 1000;
const MIN_POLL_MS = 30 * 1000;

function getHighestAnnouncementId(announcements: Array<{ id: number }>): number {
	return announcements.reduce((highestId, announcement) => Math.max(highestId, announcement.id), 0);
}

function parseMaxAgeMs(response: Response): number {
	const cc = response.headers.get('Cache-Control')?.toLowerCase() ?? '';
	const m = cc.match(/\bmax-age\s*=\s*(\d+)/);
	if (!m) return DEFAULT_POLL_MS;
	return Math.max(MIN_POLL_MS, parseInt(m[1], 10) * 1000);
}

export function startLatestAnnouncementsPolling(
	onUpdate: (data: TaggedLatestAnnouncements[]) => void
): () => void {
	if (!browser) return () => {};

	let timer: ReturnType<typeof setTimeout> | null = null;
	let canceled = false;

	async function poll(): Promise<void> {
		timer = null;
		if (canceled) return;
		let nextDelay = DEFAULT_POLL_MS;
		try {
			const response = await fetch(composeApiUrl(getApiUrl(), 'announcements/latest'));
			if (response.ok) {
				const data = await response.json();
				const parsed = LatestAnnouncementsSchema.safeParse(data);
				if (parsed.success) onUpdate(parsed.data);
				nextDelay = parseMaxAgeMs(response);
			}
		} catch {
		}
		if (!canceled && document.visibilityState !== 'hidden') {
			timer = setTimeout(poll, nextDelay);
		}
	}

	const onVisibility = () => {
		if (document.visibilityState === 'visible' && !timer && !canceled) {
			void poll();
		}
	};
	document.addEventListener('visibilitychange', onVisibility);

	timer = setTimeout(poll, DEFAULT_POLL_MS);

	return () => {
		canceled = true;
		if (timer) clearTimeout(timer);
		document.removeEventListener('visibilitychange', onVisibility);
	};
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
