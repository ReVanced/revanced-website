import type { PageServerLoad } from './$types';
import { fetchContributorsServer } from '$lib/api/server';

export const load: PageServerLoad = async ({ fetch }) => {
	const contributors = await fetchContributorsServer(fetch).catch(() => []);
	return { contributors };
};
