import { createQuery, useQueryClient } from '@tanstack/svelte-query';
import { browser } from '$app/environment';
import { dev_log } from '$lib/utils/dev';
import {
	fetchAbout,
	fetchTeam,
	fetchManager,
	fetchContributors,
	fetchAnnouncementById,
	fetchAnnouncements
} from '$api/client';
import type {
	About,
	TeamMember,
	ManagerRelease,
	Contributable,
	Announcement
} from '$api/types';
import { queryKeys } from './queryClient';

// NOTE: This file is no longer used. All data fetching has been moved to
// server load functions (+page.server.ts / +layout.server.ts).
// Kept for reference only.

const STALE_TIMES = {
	STATIC: 5 * 60 * 1000,
	SEMI_DYNAMIC: 2 * 60 * 1000,
	DYNAMIC: 1 * 60 * 1000,
} as const;

const GC_TIMES = {
	LONG: 24 * 60 * 60 * 1000,
	MEDIUM: 60 * 60 * 1000,
	SHORT: 30 * 60 * 1000,
} as const;

const REFETCH_INTERVALS = {
	ANNOUNCEMENTS: 2 * 60 * 1000,
} as const;

export function useAboutQuery() {
	return createQuery(() => ({
		queryKey: queryKeys.about,
		queryFn: fetchAbout,
		staleTime: STALE_TIMES.STATIC,
		gcTime: GC_TIMES.LONG,
		enabled: browser,
	}));
}

export function useTeamQuery() {
	return createQuery(() => ({
		queryKey: queryKeys.team,
		queryFn: fetchTeam,
		staleTime: STALE_TIMES.STATIC,
		gcTime: GC_TIMES.LONG,
		enabled: browser,
	}));
}

export function useManagerQuery() {
	return createQuery(() => ({
		queryKey: queryKeys.manager,
		queryFn: fetchManager,
		staleTime: STALE_TIMES.SEMI_DYNAMIC,
		gcTime: GC_TIMES.MEDIUM,
		enabled: browser,
	}));
}

export function useContributorsQuery() {
	return createQuery(() => ({
		queryKey: queryKeys.contributors,
		queryFn: fetchContributors,
		staleTime: STALE_TIMES.STATIC,
		gcTime: GC_TIMES.LONG,
		enabled: browser,
	}));
}

export function useAnnouncementsQuery(options?: { enablePolling?: boolean }) {
	return createQuery(() => ({
		queryKey: queryKeys.announcements,
		queryFn: () => fetchAnnouncements(),
		staleTime: STALE_TIMES.DYNAMIC,
		gcTime: GC_TIMES.SHORT,
		refetchInterval: options?.enablePolling ? REFETCH_INTERVALS.ANNOUNCEMENTS : false,
		refetchIntervalInBackground: false,
		enabled: browser,
	}));
}

export function useAnnouncementByIdQuery(id: () => number | null) {
	return createQuery(() => ({
		queryKey: queryKeys.announcement(id() ?? 0),
		queryFn: () => fetchAnnouncementById(id()!),
		staleTime: STALE_TIMES.DYNAMIC,
		gcTime: GC_TIMES.SHORT,
		enabled: browser && id() !== null,
	}));
}

export function useInvalidateAnnouncements() {
	const queryClient = useQueryClient();
	return async () => {
		await queryClient.refetchQueries({ queryKey: queryKeys.announcements });
	};
}

export function useInvalidateAnnouncement() {
	const queryClient = useQueryClient();
	return (id: number) => {
		queryClient.invalidateQueries({ queryKey: queryKeys.announcement(id) });
	};
}

export function usePrefetchAnnouncement() {
	const queryClient = useQueryClient();
	return (id: number) => {
		dev_log('Prefetch', 'announcement', id);
		queryClient.prefetchQuery({
			queryKey: queryKeys.announcement(id),
			queryFn: () => fetchAnnouncementById(id),
			staleTime: STALE_TIMES.DYNAMIC,
		});
	};
}
export function usePrefetchNavQueries() {
	const queryClient = useQueryClient();

	return {
		prefetchContributors: () => {
			dev_log('Prefetch', 'contributors');
			queryClient.prefetchQuery({
				queryKey: queryKeys.contributors,
				queryFn: fetchContributors,
				staleTime: STALE_TIMES.STATIC,
			});
		},
		prefetchManager: () => {
			dev_log('Prefetch', 'manager');
			queryClient.prefetchQuery({
				queryKey: queryKeys.manager,
				queryFn: fetchManager,
				staleTime: STALE_TIMES.SEMI_DYNAMIC,
			});
		},
		prefetchAnnouncements: () => {
			dev_log('Prefetch', 'announcements');
			queryClient.prefetchQuery({
				queryKey: queryKeys.announcements,
				queryFn: () => fetchAnnouncements(),
				staleTime: STALE_TIMES.DYNAMIC,
			});
		},
	};
}
