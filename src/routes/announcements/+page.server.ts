import type { PageServerLoad } from './$types';
import { fetchAnnouncements } from '$lib/api/server';

export const load: PageServerLoad = async ({ fetch }) => {
	const announcements = await fetchAnnouncements(fetch).catch(() => []);

	return { announcements };
};
