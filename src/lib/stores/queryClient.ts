import { browser } from '$app/environment';
import { QueryClient } from '@tanstack/svelte-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

export const STALE_TIMES = {
	STATIC: 5 * 60 * 1000,
	SEMI_DYNAMIC: 2 * 60 * 1000,
	DYNAMIC: 1 * 60 * 1000,
} as const;

export const GC_TIMES = {
	LONG: 24 * 60 * 60 * 1000,
	MEDIUM: 60 * 60 * 1000,
	SHORT: 30 * 60 * 1000,
} as const;

export const REFETCH_INTERVALS = {
	ANNOUNCEMENTS: 2 * 60 * 1000,
	API_HEALTH: 5 * 60 * 1000,
} as const;

export const queryKeys = {
	about: ['about'] as const,
	team: ['team'] as const,
	manager: ['manager'] as const,
	contributors: ['contributors'] as const,
	patches: ['patches'] as const,
	announcements: ['announcements'] as const,
	announcementTags: ['announcement-tags'] as const,
	announcement: (id: number) => ['announcement', id] as const,
} as const;

export function createQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				retry: false,
				staleTime: STALE_TIMES.STATIC,
				gcTime: GC_TIMES.LONG,
				enabled: browser,
			},
		},
	});
}

export function createPersister() {
	if (!browser) return undefined;
	
	return createSyncStoragePersister({
		storage: window.localStorage,
		key: 'revanced-query-cache',
		serialize: (data) => JSON.stringify(data),
		deserialize: (data) => JSON.parse(data),
	});
}

let queryClientInstance: QueryClient | null = null;

export function getQueryClient(): QueryClient {
	if (!queryClientInstance) {
		queryClientInstance = createQueryClient();
	}
	return queryClientInstance;
}
