import type { AnnouncementPayload } from './client';

export type AnnouncementDraft = {
	title: string;
	content: string;
	author: string;
	tags: string[];
	createdAt: string | undefined;
	archivedAt: string | null;
};

export function buildAnnouncementPayload(draft: AnnouncementDraft): AnnouncementPayload {
	return {
		title: draft.title.trim(),
		content: draft.content.trim() || undefined,
		author: draft.author.trim(),
		tags: [...draft.tags],
		created_at: draft.createdAt,
		archived_at: draft.archivedAt
	};
}
