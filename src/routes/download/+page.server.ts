import type { PageServerLoad } from './$types';
import { fetchManager } from '$lib/api/server';
import { createStorageFromPlatform } from '$lib/api/storage';

export const load: PageServerLoad = async ({ fetch, platform }) => {
	const storage = createStorageFromPlatform(platform);
	const manager = await fetchManager(fetch, storage).catch(() => null);
	return { manager };
};
