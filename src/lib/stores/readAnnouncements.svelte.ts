import { PersistedState } from 'runed';
import type { Announcement } from '$api/types';

const STORAGE_KEY = 'read_announcements_latest_id';
const LEGACY_STORAGE_KEY = 'read_announcements';

function getHighestAnnouncementId(announcements: Array<{ id: number }>): number {
	return announcements.reduce((highestId, announcement) => Math.max(highestId, announcement.id), 0);
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
