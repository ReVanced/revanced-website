import { PersistedState } from 'runed';

export const theme = new PersistedState<'light' | 'dark'>('theme', 'light');

export {
	aboutQuery,
	teamQuery,
	managerQuery,
	contributorsQuery,
	patchesQuery,
	announcementsQuery,
	announcementTagsQuery,
	allQueries,
	initializeAllQueries,
	refetchAnnouncements,
	getAnnouncementById
} from './queries.svelte';

export type { QueryResult } from './queries.svelte';

export {
	apiStatus,
	manualRefresh,
	startApiHealthPolling,
	stopApiHealthPolling
} from './apiHealth.svelte';

export { readAnnouncements } from './readAnnouncements.svelte';

export { announcementPolling } from './announcementPolling.svelte';

export { auth } from './auth.svelte';

export { modalsStack } from './modals.svelte';
