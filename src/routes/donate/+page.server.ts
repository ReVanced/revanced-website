import type { PageServerLoad } from './$types';
import { fetchTeam } from '$lib/api/server';

export const load: PageServerLoad = async ({ fetch }) => {
	const team = await fetchTeam(fetch).catch(() => []);
	return { team };
};
