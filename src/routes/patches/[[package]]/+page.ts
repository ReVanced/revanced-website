import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const selectedPkg = params.package || undefined;
	return { selectedPkg };
};
