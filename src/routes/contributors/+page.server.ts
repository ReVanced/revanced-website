import type { PageServerLoad } from './$types';
import { fetchContributors } from '$lib/api/server';

export const load: PageServerLoad = async ({ fetch }) => {
	const contributors = await fetchContributors(fetch).catch(() => []);
	return { contributors };
};
