import { QueryClient } from '@tanstack/svelte-query';

export const queryKeys = {
	about: ['about'] as const,
	team: ['team'] as const,
	manager: ['manager'] as const,
	contributors: ['contributors'] as const,
	announcements: ['announcements'] as const,
	announcement: (id: number) => ['announcement', id] as const,
} as const;

export function createQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				retry: false,
			},
		},
	});
}

let queryClientInstance: QueryClient | null = null;

export function getQueryClient(): QueryClient {
	if (!queryClientInstance) {
		queryClientInstance = createQueryClient();
	}
	return queryClientInstance;
}
