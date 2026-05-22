import type { PageServerLoad } from './$types';
import { fetchTeam } from '$lib/api/server';

export const load: PageServerLoad = async ({ fetch, platform }) => {
	const team = await fetchTeam(fetch, platform).catch(() => []);
	return { team };
};
