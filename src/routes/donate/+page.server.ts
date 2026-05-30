import type { PageServerLoad } from './$types';
import { fetchTeam } from '$lib/api/server';
import { createStorageFromPlatform } from '$lib/api/storage';

export const load: PageServerLoad = async ({ fetch, platform }) => {
	const storage = createStorageFromPlatform(platform);
	const team = await fetchTeam(fetch, storage).catch(() => []);
	return { team };
};
