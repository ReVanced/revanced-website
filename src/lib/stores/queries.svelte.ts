import { resource, PersistedState } from 'runed';
import { browser } from '$app/environment';
import {
	fetchAbout,
	fetchTeam,
	fetchManager,
	fetchContributors,
	fetchPatches,
	fetchAnnouncements,
	fetchAnnouncementById
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
const ANNOUNCEMENT_CACHE_KEY = `${CACHE_PREFIX}announcements_by_id`;

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

	let res: ReturnType<typeof resource<[true], T>> | null = null;
	let manualLoading = $state(false);
	let manualError = $state<Error | null>(null);
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

	const manualRefetch = async (): Promise<T | undefined> => {
		if (!browser) return undefined;

		if (res) {
			try {
				return res.refetch() as Promise<T | undefined>;
			} catch {
				// fall through
			}
		}

		manualLoading = true;
		manualError = null;
		try {
			const data = await fetcher();
			cache.current = { data, timestamp: Date.now() };
			staleRefetchTriggered = false;
			return data;
		} catch (error) {
			manualError = error instanceof Error ? error : new Error(String(error));
			return undefined;
		} finally {
			manualLoading = false;
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
			return (r.loading || manualLoading) && !hasData;
		},
		get refreshing() {
			const r = getResource();
			const hasData = r.current !== undefined || cache.current?.data !== undefined;
			return (r.loading || manualLoading) && hasData;
		},
		get error() {
			return getResource().error ?? manualError ?? null;
		},
		get hasData() {
			return getResource().current !== undefined || cache.current?.data !== undefined;
		},
		get isStale() {
			return isStale();
		},
		refetch: manualRefetch,
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

// must be called in component setup to avoid effect_orphan errors
export function initializeAllQueries() {
	for (const query of allQueries) {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		query.data;
	}
}

export function refetchAllQueries() {
	allQueries.forEach(q => q.refetch());
}

export function invalidateAllQueries() {
	allQueries.forEach(q => q.invalidate());
}

type AnnouncementCache = { [id: number]: { data: Announcement; timestamp: number } };

const announcementByIdCache = new PersistedState<AnnouncementCache>(ANNOUNCEMENT_CACHE_KEY, {});

const isAnnouncementStale = (id: number) => {
	const cached = announcementByIdCache.current[id];
	return !cached || Date.now() - cached.timestamp > STALE_TIME;
};

export function getCachedAnnouncement(id: number) {
	return announcementByIdCache.current[id]?.data ?? null;
}

export const hasValidCachedAnnouncement = (id: number) => !isAnnouncementStale(id);

export async function prefetchAnnouncementById(id: number) {
	if (!browser) return null;
	if (!isAnnouncementStale(id)) return announcementByIdCache.current[id]?.data ?? null;

	try {
		const data = await fetchAnnouncementById(id);
		announcementByIdCache.current = { ...announcementByIdCache.current, [id]: { data, timestamp: Date.now() } };
		return data;
	} catch (e) {
		console.error(`Failed to prefetch announcement ${id}:`, e);
		return announcementByIdCache.current[id]?.data ?? null;
	}
}

export function cacheAnnouncement(announcement: Announcement) {
	if (!browser) return;
	announcementByIdCache.current = { ...announcementByIdCache.current, [announcement.id]: { data: announcement, timestamp: Date.now() } };
}

export function invalidateAnnouncementCache(id: number) {
	if (!browser) return;
	const { [id]: _, ...rest } = announcementByIdCache.current;
	announcementByIdCache.current = rest;
}

export function invalidateAllAnnouncementCache() {
	if (browser) announcementByIdCache.current = {};
}
