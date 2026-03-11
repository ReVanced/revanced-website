import type { PageServerLoad } from './$types';
import { fetchManager } from '$lib/api/server';

export const load: PageServerLoad = async ({ fetch }) => {
	const manager = await fetchManager(fetch).catch(() => null);
	return { manager };
};
