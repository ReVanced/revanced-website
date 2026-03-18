import type { PageLoad } from './$types';

export const load: PageLoad = ({ data }) => {
	return {
		announcements: data.announcements
	};
};
