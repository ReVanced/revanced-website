import type { LayoutServerLoad } from './$types';
import { fetchAbout, fetchLatestAnnouncements } from '$lib/api/server';

export const load: LayoutServerLoad = async ({ fetch, platform }) => {
	const [about, latestAnnouncements] = await Promise.all([
		fetchAbout(fetch, platform).catch(() => null),
		fetchLatestAnnouncements(fetch, platform).catch(() => [])
	]);

	return { about, latestAnnouncements };
};
