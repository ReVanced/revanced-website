import type { LayoutServerLoad } from './$types';
import { fetchAboutServer, fetchAnnouncementsServer } from '$lib/api/server';

export const load: LayoutServerLoad = async ({ fetch }) => {
	const [about, announcements] = await Promise.all([
		fetchAboutServer(fetch).catch(() => null),
		fetchAnnouncementsServer(fetch).catch(() => [])
	]);

	return { about, announcements };
};
