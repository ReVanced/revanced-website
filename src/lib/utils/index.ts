export const isValidUrl = (str: string) => {
	try { new URL(str); return true; } catch { return false; }
};

export const debounce = <T extends any[]>(fn: (...args: T) => void, delay = 350) => {
	let timeout: ReturnType<typeof setTimeout>;
	return (...args: T) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), delay);
	};
};

export const isArchived = (archivedAt: string | null) =>
	archivedAt ? new Date(archivedAt) < new Date() : false;

export const isScheduled = (createdAt: string) =>
	new Date(createdAt) > new Date();

export const isVisible = (createdAt: string, isLoggedIn: boolean) =>
	isLoggedIn || !isScheduled(createdAt);

export const toSlug = (title: string) =>
	title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export const buildAnnouncementPath = (id: number, title: string) =>
	`/announcements?id=${id}-${toSlug(title)}`;

export * from './relativeTime';
export * from './filter';
export * from './horizontalSlide';
export * from './dev';
export * from './themeEvents.svelte';
