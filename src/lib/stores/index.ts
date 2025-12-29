import { PersistedState } from 'runed';

export const theme = new PersistedState<'light' | 'dark'>('theme', 'light');

export {
	useAboutQuery,
	useTeamQuery,
	useManagerQuery,
	useContributorsQuery,
	usePatchesQuery,
	useAnnouncementsQuery,
	useAnnouncementTagsQuery,
	useAnnouncementByIdQuery,
	useInvalidateAnnouncements,
	useInvalidateAnnouncement,
	usePrefetchAnnouncement,
	usePrefetchNavQueries
} from './queries.svelte';

export {
	queryKeys,
	getQueryClient,
	createPersister
} from './queryClient';

export { readAnnouncements, announcementPolling } from './readAnnouncements.svelte';

export { auth } from './auth.svelte';

export { modalsStack } from './modals.svelte';
