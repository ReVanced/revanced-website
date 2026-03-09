import type { LayoutServerLoad } from './$types';
import { fetchAbout, fetchAnnouncements } from '$lib/api/server';

export const load: LayoutServerLoad = async ({ fetch }) => {
	const [about, announcements] = await Promise.all([
		fetchAbout(fetch).catch(() => null),
		fetchAnnouncements(fetch).catch(() => [])
	]);

	return { about, announcements };
};
