import type { PageServerLoad } from './$types';
import { fetchManagerServer } from '$lib/api/server';

export const load: PageServerLoad = async ({ fetch }) => {
	const manager = await fetchManagerServer(fetch).catch(() => null);
	return { manager };
};
