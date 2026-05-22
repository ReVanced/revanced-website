import type { PageServerLoad } from './$types';
import { fetchManager } from '$lib/api/server';

export const load: PageServerLoad = async ({ fetch, platform }) => {
	const manager = await fetchManager(fetch, platform).catch(() => null);
	return { manager };
};
