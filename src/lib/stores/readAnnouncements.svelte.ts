import { browser } from '$app/environment';
import { PersistedState } from 'runed';
import type { Announcement } from '$api/types';

const STORAGE_KEY = 'read_announcements';

const readIds = new PersistedState<number[]>(STORAGE_KEY, [], {
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

export const announcementPolling = {
	get data(): Announcement[] {
		return _announcements;
	},

	syncData(announcements: Announcement[]) {
		_announcements = announcements;
		if (browser && announcements.length > 0) {
			readAnnouncements.cleanup(announcements.map((a) => a.id));
		}
	}
};

class ReadAnnouncementsTracker {
	get ids(): readonly number[] {
		return readIds.current;
	}

	private get idSet() {
		return new Set(readIds.current);
	}

	isRead(id: number) {
		return this.idSet.has(id);
	}

	markAsRead(id: number) {
		if (!this.idSet.has(id)) readIds.current = [...readIds.current, id];
	}

	markManyAsRead(ids: number[]) {
		const current = this.idSet;
		const newIds = ids.filter((id) => !current.has(id));
		if (newIds.length) readIds.current = [...readIds.current, ...newIds];
	}

	markAsUnread(id: number) {
		readIds.current = readIds.current.filter((rid) => rid !== id);
	}

	clearAll() {
		readIds.current = [];
	}

	countUnread(ids: number[]) {
		return ids.filter((id) => !this.isRead(id)).length;
	}

	cleanup(currentAnnouncementIds: number[]) {
		const currentSet = new Set(currentAnnouncementIds);
		const storedIds = readIds.current;
		const validIds = storedIds.filter((id) => currentSet.has(id));
		if (validIds.length !== storedIds.length) {
			readIds.current = validIds;
		}
	}
}

export const readAnnouncements = new ReadAnnouncementsTracker();
