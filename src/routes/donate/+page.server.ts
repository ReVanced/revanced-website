import type { PageServerLoad } from './$types';
import { fetchTeamServer } from '$lib/api/server';

export const load: PageServerLoad = async ({ fetch }) => {
	const team = await fetchTeamServer(fetch).catch(() => []);
	return { team };
};
