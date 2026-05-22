import type { PageServerLoad } from './$types';
import { fetchAnnouncements } from '$lib/api/server';

export const load: PageServerLoad = async ({ fetch, platform }) => {
	const announcements = await fetchAnnouncements(fetch, platform).catch(() => []);

	return { announcements };
};
