import { PersistedState } from 'runed';

export const theme = new PersistedState<'light' | 'dark'>('theme', 'light');

export const readBannerIds = new PersistedState<string[]>('read_banner_ids', []);

export {
	aboutQuery,
	teamQuery,
	managerQuery,
	contributorsQuery,
	patchesQuery,
	announcementsQuery,
	allQueries,
	refetchAllQueries,
	invalidateAllQueries
} from './queries.svelte';

export {
	apiStatus,
	startRefreshInterval,
	stopRefreshInterval,
	manualRefresh
} from './apiHealth.svelte';

export { readAnnouncements } from './readAnnouncements.svelte';

export { footerVisibility } from './footerVisibility.svelte';

export { auth } from './auth.svelte';
