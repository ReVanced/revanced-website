import { browser } from '$app/environment';
import { fetchAnnouncements } from '$api/client';
import type { Announcement } from '$api/types';
import { readAnnouncements } from './readAnnouncements.svelte';

const POLL_INTERVAL = 2 * 60 * 1000;
const MAX_BACKOFF = 10 * 60 * 1000;
const BASE_RETRY_DELAY = 30 * 1000;

let _announcements = $state<Announcement[]>([]);
let _loading = $state(false);
let _error = $state<Error | null>(null);
let _intervalId: ReturnType<typeof setInterval> | null = null;
let _initialized = false;
let _consecutiveFailures = 0;

export const announcementPolling = {
	get data(): Announcement[] {
		return _announcements;
	},

	get loading(): boolean {
		return _loading;
	},

	get error(): Error | null {
		return _error;
	},

	get unreadCount(): number {
		const ids = _announcements.map((a) => a.id);
		return readAnnouncements.countUnread(ids);
	},

	get hasUnread(): boolean {
		return this.unreadCount > 0;
	},

	get unreadIds(): number[] {
		return _announcements.filter((a) => !readAnnouncements.isRead(a.id)).map((a) => a.id);
	},

	start() {
		if (!browser || _initialized) return;
		_initialized = true;
		_consecutiveFailures = 0;

		this.fetch();
		_intervalId = setInterval(() => {
			this.fetch();
		}, POLL_INTERVAL);
	},
	stop() {
		if (_intervalId) {
			clearInterval(_intervalId);
			_intervalId = null;
		}
		_initialized = false;
		_consecutiveFailures = 0;
	},

	async fetch(): Promise<Announcement[]> {
		if (!browser) return [];

		_loading = true;
		_error = null;

		try {
			const data = await fetchAnnouncements();
			_announcements = data;
			_consecutiveFailures = 0;
			
			readAnnouncements.cleanup(data.map((a) => a.id));
			
			return data;
		} catch (e) {
			_error = e instanceof Error ? e : new Error(String(e));
			_consecutiveFailures++;
			
			const backoffTime = Math.min(BASE_RETRY_DELAY * Math.pow(2, _consecutiveFailures - 1), MAX_BACKOFF);
			console.error(`[AnnouncementPolling] Fetch failed (attempt ${_consecutiveFailures}), next retry in ${backoffTime / 1000}s:`, e);
			if (_consecutiveFailures >= 3 && _intervalId) {
				clearInterval(_intervalId);
				_intervalId = setInterval(() => {
					this.fetch();
				}, backoffTime);
			}
			
			return _announcements;
		} finally {
			_loading = false;
		}
	},

	async refetch(): Promise<Announcement[]> {
		return this.fetch();
	},

	markAsRead(id: number) {
		readAnnouncements.markAsRead(id);
	},

	markAllAsRead() {
		const ids = _announcements.map((a) => a.id);
		readAnnouncements.markManyAsRead(ids);
	},

	isRead(id: number): boolean {
		return readAnnouncements.isRead(id);
	}
};
