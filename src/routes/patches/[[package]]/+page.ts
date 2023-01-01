import { patches } from '$data/api';
import type { PageLoad } from './$types';

const api = patches.page_load_impl();

export const load: PageLoad = async ({ params, fetch }) => {
	const selectedPkg = params.package || undefined;
	await api({ fetch });
	return { selectedPkg };
};
