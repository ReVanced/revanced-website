import type { PageServerLoad } from './$types';
import { fetchContributors } from '$lib/api/server';

export const load: PageServerLoad = async ({ fetch, platform }) => {
	const contributors = await fetchContributors(fetch, platform).catch(() => []);
	return { contributors };
};
