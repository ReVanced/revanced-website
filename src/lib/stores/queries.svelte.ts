import { createQuery, useQueryClient } from '@tanstack/svelte-query';
import { browser } from '$app/environment';
import { dev_log } from '$lib/utils/dev';
import {
	fetchAbout,
	fetchTeam,
	fetchManager,
	fetchContributors,
	fetchPatches,
	fetchAnnouncementById,
	fetchAnnouncementTags,
	fetchAnnouncements
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
import { queryKeys, STALE_TIMES, GC_TIMES, REFETCH_INTERVALS } from './queryClient';

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

export function usePatchesQuery() {
	return createQuery(() => ({
		queryKey: queryKeys.patches,
		queryFn: fetchPatches,
		staleTime: STALE_TIMES.SEMI_DYNAMIC,
		gcTime: GC_TIMES.MEDIUM,
		enabled: browser,
	}));
}

export function useAnnouncementTagsQuery() {
	return createQuery(() => ({
		queryKey: queryKeys.announcementTags,
		queryFn: fetchAnnouncementTags,
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
		await Promise.all([
			queryClient.refetchQueries({ queryKey: queryKeys.announcements }),
			queryClient.refetchQueries({ queryKey: queryKeys.announcementTags }),
		]);
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
		prefetchPatches: () => {
			dev_log('Prefetch', 'patches');
			queryClient.prefetchQuery({
				queryKey: queryKeys.patches,
				queryFn: fetchPatches,
				staleTime: STALE_TIMES.SEMI_DYNAMIC,
			});
		},
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
