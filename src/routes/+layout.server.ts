import type { LayoutServerLoad } from './$types';
import { fetchAbout, fetchLatestAnnouncements } from '$lib/api/server';
import { createStorageFromPlatform } from '$lib/api/storage';

export const load: LayoutServerLoad = async ({ fetch, platform }) => {
	const storage = createStorageFromPlatform(platform);
	const [about, latestAnnouncements] = await Promise.all([
		fetchAbout(fetch, storage).catch(() => null),
		fetchLatestAnnouncements(fetch, storage).catch(() => [])
	]);

	return { about, latestAnnouncements };
};
