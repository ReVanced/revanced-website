import { PersistedState } from 'runed';

const readIds = new PersistedState<number[]>('read_announcements', []);

class ReadAnnouncementsTracker {
	get ids(): readonly number[] {
		return readIds.current;
	}

	isRead(id: number) {
		return readIds.current.includes(id);
	}

	markAsRead(id: number) {
		if (!this.isRead(id)) readIds.current = [...readIds.current, id];
	}

	markManyAsRead(ids: number[]) {
		const newIds = ids.filter((id) => !this.isRead(id));
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
}

export const readAnnouncements = new ReadAnnouncementsTracker();
