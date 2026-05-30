import type { PageServerLoad } from './$types';
import { fetchContributors } from '$lib/api/server';
import { createStorageFromPlatform } from '$lib/api/storage';

export const load: PageServerLoad = async ({ fetch, platform }) => {
	const storage = createStorageFromPlatform(platform);
	const contributors = await fetchContributors(fetch, storage).catch(() => []);
	return { contributors };
};
