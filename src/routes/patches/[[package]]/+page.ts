import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = async ({ params }) => {
	const selectedPkg = params.package || undefined;
	return { selectedPkg };
};
