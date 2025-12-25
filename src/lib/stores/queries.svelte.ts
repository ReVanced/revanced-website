import { resource } from 'runed';
import { browser } from '$app/environment';
import {
	fetchAbout,
	fetchTeam,
	fetchManager,
	fetchContributors,
	fetchPatches,
	fetchAnnouncementById,
	fetchAnnouncementTags
} from '$api/client';
import type {
	About,
	TeamMember,
	ManagerRelease,
	Contributable,
	Patch,
	Announcement,
	AnnouncementTag
} from '$api/types';
import { announcementPolling } from './announcementPolling.svelte';

export type QueryResult<T> = {
	readonly data: T | null;
	readonly loading: boolean;
	readonly error: Error | null;
};

export type RefetchableQueryResult<T> = QueryResult<T> & {
	refetch: () => Promise<T>;
};
function createQuery<T>(
	fetcher: () => Promise<T>,
	defaultValue: T
) {
	let data = $state<T>(defaultValue);
	let loading = $state(false);
	let error = $state<Error | null>(null);
	let fetched = false;

	async function doFetch() {
		if (!browser || fetched) return;
		fetched = true;
		loading = true;
		error = null;
		try {
			data = await fetcher();
		} catch (e) {
			error = e instanceof Error ? e : new Error(String(e));
			console.error('[Query] Fetch failed:', e);
		} finally {
			loading = false;
		}
	}

	if (browser) {
		doFetch();
	}

	return {
		get data() {
			return data;
		},
		get loading() {
			return loading;
		},
		get error() {
			return error;
		},
		async refetch() {
			fetched = false;
			await doFetch();
			return data;
		}
	};
}
const _aboutQuery = createQuery<About | null>(fetchAbout, null);
const _teamQuery = createQuery<TeamMember[]>(fetchTeam, []);
const _managerQuery = createQuery<ManagerRelease | null>(fetchManager, null);
const _contributorsQuery = createQuery<Contributable[]>(fetchContributors, []);
const _patchesQuery = createQuery<Patch[]>(fetchPatches, []);
const _announcementTagsQuery = createQuery<AnnouncementTag[]>(fetchAnnouncementTags, []);

const announcementCache = new Map<number, ReturnType<typeof createQuery<Announcement | null>>>();
export const aboutQuery: QueryResult<About | null> = {
	get data() {
		return _aboutQuery.data;
	},
	get loading() {
		return _aboutQuery.loading;
	},
	get error() {
		return _aboutQuery.error;
	}
};

export const teamQuery: QueryResult<TeamMember[]> = {
	get data() {
		return _teamQuery.data;
	},
	get loading() {
		return _teamQuery.loading;
	},
	get error() {
		return _teamQuery.error;
	}
};

export const managerQuery: QueryResult<ManagerRelease | null> = {
	get data() {
		return _managerQuery.data;
	},
	get loading() {
		return _managerQuery.loading;
	},
	get error() {
		return _managerQuery.error;
	}
};

export const contributorsQuery: QueryResult<Contributable[]> = {
	get data() {
		return _contributorsQuery.data;
	},
	get loading() {
		return _contributorsQuery.loading;
	},
	get error() {
		return _contributorsQuery.error;
	}
};

export const patchesQuery: QueryResult<Patch[]> = {
	get data() {
		return _patchesQuery.data;
	},
	get loading() {
		return _patchesQuery.loading;
	},
	get error() {
		return _patchesQuery.error;
	}
};

export const announcementTagsQuery: QueryResult<AnnouncementTag[]> = {
	get data() {
		return _announcementTagsQuery.data;
	},
	get loading() {
		return _announcementTagsQuery.loading;
	},
	get error() {
		return _announcementTagsQuery.error;
	}
};

export const announcementsQuery = announcementPolling;

export function getAnnouncementById(id: number): QueryResult<Announcement | null> {
	if (!announcementCache.has(id)) {
		announcementCache.set(id, createQuery<Announcement | null>(
			() => fetchAnnouncementById(id),
			null
		));
	}
	const query = announcementCache.get(id)!;
	return {
		get data() {
			return query.data;
		},
		get loading() {
			return query.loading;
		},
		get error() {
			return query.error;
		}
	};
}
export const allQueries = [
	aboutQuery,
	teamQuery,
	managerQuery,
	contributorsQuery,
	patchesQuery,
	announcementsQuery,
	announcementTagsQuery
] as const;

export function initializeAllQueries() {
}
export function refetchAnnouncements() {
	return announcementsQuery.refetch();
}
