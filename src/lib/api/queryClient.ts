import { browser } from '$app/environment';
import { QueryClient } from '@tanstack/svelte-query';
import { persistQueryClient } from '@tanstack/query-persist-client-core';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

const STALE_TIME = 5 * 60 * 1000;
const GC_TIME = 30 * 60 * 1000;

export function createQueryClient(): QueryClient {
	return new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				staleTime: STALE_TIME,
				gcTime: GC_TIME,
				retry: 2,
				retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
				refetchOnWindowFocus: false,
				refetchOnReconnect: true
			}
		}
	});
}

export function setupQueryPersistence(queryClient: QueryClient): (() => void) | undefined {
	if (!browser) return undefined;

	const persister = createSyncStoragePersister({
		storage: localStorage,
		key: 'rv_query_cache'
	});

	const [unsubscribe] = persistQueryClient({
		queryClient,
		persister,
		maxAge: GC_TIME,
		dehydrateOptions: {
			shouldDehydrateQuery: (query) => {
				return query.state.status === 'success';
			}
		}
	});

	return unsubscribe;
}
