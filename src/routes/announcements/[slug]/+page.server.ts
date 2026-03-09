import type { PageServerLoad } from './$types';
import { fetchAnnouncementsServer } from '$lib/api/server';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const slug = params.slug;

	if (slug === 'create') {
		return { announcement: null, isCreating: true };
	}

	const idPart = slug.split('-')[0];
	const id = parseInt(idPart, 10);

	if (isNaN(id)) {
		error(404, 'Announcement not found');
	}

	const announcements = await fetchAnnouncementsServer(fetch).catch(() => []);
	const announcement = announcements.find((a) => a.id === id) ?? null;

	if (!announcement) {
		error(404, 'Announcement not found');
	}

	return { announcement, isCreating: false };
};
