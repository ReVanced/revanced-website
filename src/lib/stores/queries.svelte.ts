import { resource, PersistedState } from 'runed';
import { browser } from '$app/environment';
import {
	fetchAbout,
	fetchTeam,
	fetchManager,
	fetchContributors,
	fetchPatches,
	fetchAnnouncements
} from '$api/client';
import type {
	About,
	TeamMember,
	ManagerRelease,
	Contributable,
	Patch,
	Announcement
} from '$api/types';

const CACHE_PREFIX = 'rv_cache_';
const STALE_TIME = 5 * 60 * 1000;

type QueryResult<T> = {
	readonly data: T | null;
	readonly loading: boolean;
	readonly refreshing: boolean;
	readonly error: Error | null;
	readonly hasData: boolean;
	readonly isStale: boolean;
	refetch: () => Promise<T | undefined>;
	invalidate: () => void;
};

function createLazyCachedResource<T>(
	key: string,
	fetcher: () => Promise<T>,
	defaultValue: T
): QueryResult<T> {
	const cache = new PersistedState<{ data: T; timestamp: number } | null>(
		`${CACHE_PREFIX}${key}`,
		null
	);

	let res: any = null;
	
	let staleRefetchTriggered = false;

	const isStale = () => {
		if (!cache.current) return true;
		return Date.now() - cache.current.timestamp > STALE_TIME;
	};

	const getResource = () => {
		if (!res) {
			const cachedData = cache.current?.data;
			const hasValidCache = cachedData !== undefined && cachedData !== null;
			
			res = resource<true, unknown>(
				() => true as const,
				async () => {
					if (!browser) return cachedData ?? defaultValue;

					try {
						const data = await fetcher();
						cache.current = { data, timestamp: Date.now() };
						staleRefetchTriggered = false;
						return data;
					} catch (error) {
						staleRefetchTriggered = false;
						if (cachedData) {
							return cachedData;
						}
						throw error;
					}
				},
				{
					initialValue: hasValidCache ? cachedData : defaultValue,
					once: hasValidCache
				}
			);
		}
		return res;
	};

	const checkAndRefetchIfStale = () => {
		if (browser && isStale() && !staleRefetchTriggered && res && !res.loading) {
			queueMicrotask(() => {
				if (!staleRefetchTriggered && res && !res.loading) {
					staleRefetchTriggered = true;
					res.refetch();
				}
			});
		}
	};

	return {
		get data() {
			const r = getResource();
			checkAndRefetchIfStale();
			return (r.current as T) ?? cache.current?.data ?? null;
		},
		get loading() {
			const r = getResource();
			const hasData = r.current !== undefined || cache.current?.data !== undefined;
			return r.loading && !hasData;
		},
		get refreshing() {
			const r = getResource();
			const hasData = r.current !== undefined || cache.current?.data !== undefined;
			return r.loading && hasData;
		},
		get error() {
			return getResource().error ?? null;
		},
		get hasData() {
			return getResource().current !== undefined || cache.current?.data !== undefined;
		},
		get isStale() {
			return isStale();
		},
		refetch: () => {
			staleRefetchTriggered = false;
			return getResource().refetch();
		},
		invalidate: () => {
			cache.current = null;
			staleRefetchTriggered = false;
		}
	};
}

export const aboutQuery = createLazyCachedResource<About>(
	'about',
	fetchAbout,
	{} as About
);

export const teamQuery = createLazyCachedResource<TeamMember[]>(
	'team',
	fetchTeam,
	[]
);

export const managerQuery = createLazyCachedResource<ManagerRelease>(
	'manager',
	fetchManager,
	{} as ManagerRelease
);

export const contributorsQuery = createLazyCachedResource<Contributable[]>(
	'contributors',
	fetchContributors,
	[]
);

export const patchesQuery = createLazyCachedResource<Patch[]>(
	'patches',
	fetchPatches,
	[]
);

export const announcementsQuery = createLazyCachedResource<Announcement[]>(
	'announcements',
	fetchAnnouncements,
	[]
);

export const allQueries = [
	aboutQuery,
	teamQuery,
	managerQuery,
	contributorsQuery,
	patchesQuery,
	announcementsQuery
] as const;

export function refetchAllQueries(): void {
	for (const query of allQueries) {
		query.refetch();
	}
}

export function invalidateAllQueries(): void {
	for (const query of allQueries) {
		query.invalidate();
	}
}
