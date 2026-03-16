import type { PageLoad } from './$types';

export const load: PageLoad = ({ url, data }) => {
	const id = url.searchParams.get('id');
	return {
		id,
		announcements: data.announcements
	};
};
