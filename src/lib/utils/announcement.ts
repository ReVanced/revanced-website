export const isArchived = (archivedAt: string | null) =>
	archivedAt ? new Date(archivedAt) < new Date() : false;

export const toSlug = (title: string) =>
	title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export const buildAnnouncementPath = (id: number, title: string) =>
	`/announcements/${id}-${toSlug(title)}`;
