import type { LayoutServerLoad } from './$types';
import { fetchAbout, fetchLatestAnnouncements } from '$lib/api/server';

export const load: LayoutServerLoad = async ({ fetch }) => {
	const [about, latestAnnouncements] = await Promise.all([
		fetchAbout(fetch).catch(() => null),
		fetchLatestAnnouncements(fetch).catch(() => [])
	]);

	return { about, latestAnnouncements };
};
