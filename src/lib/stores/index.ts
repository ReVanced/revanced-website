import { PersistedState } from 'runed';

export const theme = new PersistedState<'light' | 'dark'>('theme', 'light');

export {
	queryKeys,
	getQueryClient,
} from './queryClient';

export { readAnnouncements, announcementPolling } from './readAnnouncements.svelte';

export { auth } from './auth.svelte';

export { modalsStack } from './modals.svelte';
