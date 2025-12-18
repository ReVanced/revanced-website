import { PersistedState } from 'runed';

export const theme = new PersistedState<'light' | 'dark'>('theme', 'light');

export {
	aboutQuery,
	teamQuery,
	managerQuery,
	contributorsQuery,
	patchesQuery,
	announcementsQuery,
	allQueries,
	initializeAllQueries,
	refetchAllQueries,
	invalidateAllQueries,
	prefetchAnnouncementById,
	getCachedAnnouncement,
	hasValidCachedAnnouncement,
	cacheAnnouncement,
	invalidateAnnouncementCache,
	invalidateAllAnnouncementCache
} from './queries.svelte';

export {
	apiStatus,
	manualRefresh,
	startRefreshInterval,
	stopRefreshInterval
} from './apiHealth.svelte';

export { readAnnouncements } from './readAnnouncements.svelte';

export { auth } from './auth.svelte';
