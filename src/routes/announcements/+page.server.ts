import type { PageServerLoad } from './$types';
import { fetchAnnouncements } from '$lib/api/server';
import { createStorageFromPlatform } from '$lib/api/storage';

export const load: PageServerLoad = async ({ fetch, platform }) => {
	const storage = createStorageFromPlatform(platform);
	const announcements = await fetchAnnouncements(fetch, storage).catch(() => []);

	return { announcements };
};
