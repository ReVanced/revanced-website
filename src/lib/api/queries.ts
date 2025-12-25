import { createQuery, createMutation, useQueryClient, type QueryClient } from '@tanstack/svelte-query';
import type {
	About,
	TeamMember,
	ManagerRelease,
	Contributable,
	Patch,
	Announcement,
	AnnouncementTag
} from './types';
import {
	fetchAbout,
	fetchTeam,
	fetchManager,
	fetchContributors,
	fetchPatches,
	fetchAnnouncements,
	fetchAnnouncementById,
	fetchAnnouncementTags,
	checkApiHealth,
	createAnnouncement,
	updateAnnouncement,
	deleteAnnouncement,
	type AnnouncementPayload,
	type FetchAnnouncementsOptions
} from './client';

export const queryKeys = {
	all: ['revanced'] as const,
	about: () => [...queryKeys.all, 'about'] as const,
	team: () => [...queryKeys.all, 'team'] as const,
	manager: () => [...queryKeys.all, 'manager'] as const,
	contributors: () => [...queryKeys.all, 'contributors'] as const,
	patches: () => [...queryKeys.all, 'patches'] as const,
	announcements: {
		all: () => [...queryKeys.all, 'announcements'] as const,
		list: (options?: FetchAnnouncementsOptions) =>
			[...queryKeys.announcements.all(), 'list', options] as const,
		detail: (id: number) => [...queryKeys.announcements.all(), 'detail', id] as const,
		tags: () => [...queryKeys.announcements.all(), 'tags'] as const
	},
	health: () => [...queryKeys.all, 'health'] as const
};


export const queryOptions = {
	about: () => ({
		queryKey: queryKeys.about(),
		queryFn: fetchAbout
	}),
	team: () => ({
		queryKey: queryKeys.team(),
		queryFn: fetchTeam
	}),
	manager: () => ({
		queryKey: queryKeys.manager(),
		queryFn: fetchManager
	}),
	contributors: () => ({
		queryKey: queryKeys.contributors(),
		queryFn: fetchContributors
	}),
	patches: () => ({
		queryKey: queryKeys.patches(),
		queryFn: fetchPatches
	}),
	announcements: (options?: FetchAnnouncementsOptions) => ({
		queryKey: queryKeys.announcements.list(options),
		queryFn: () => fetchAnnouncements(options)
	}),
	announcementById: (id: number) => ({
		queryKey: queryKeys.announcements.detail(id),
		queryFn: ({ signal }: { signal?: AbortSignal }) => fetchAnnouncementById(id, signal)
	}),
	announcementTags: () => ({
		queryKey: queryKeys.announcements.tags(),
		queryFn: fetchAnnouncementTags
	}),
	health: () => ({
		queryKey: queryKeys.health(),
		queryFn: checkApiHealth,
		staleTime: 30 * 1000,
		gcTime: 60 * 1000,
		refetchInterval: 5 * 60 * 1000
	})
};


export function useAboutQuery() {
	return createQuery<About, Error, About, readonly unknown[]>(() => queryOptions.about());
}

export function useTeamQuery() {
	return createQuery<TeamMember[], Error, TeamMember[], readonly unknown[]>(() => queryOptions.team());
}

export function useManagerQuery() {
	return createQuery<ManagerRelease, Error, ManagerRelease, readonly unknown[]>(() => queryOptions.manager());
}

export function useContributorsQuery() {
	return createQuery<Contributable[], Error, Contributable[], readonly unknown[]>(() => queryOptions.contributors());
}

export function usePatchesQuery() {
	return createQuery<Patch[], Error, Patch[], readonly unknown[]>(() => queryOptions.patches());
}

export function useAnnouncementsQuery(options?: FetchAnnouncementsOptions) {
	return createQuery<Announcement[], Error, Announcement[], readonly unknown[]>(() => queryOptions.announcements(options));
}

export function useAnnouncementByIdQuery(id: () => number, enabled: () => boolean = () => true) {
	return createQuery<Announcement, Error, Announcement, readonly unknown[]>(() => ({
		...queryOptions.announcementById(id()),
		enabled: enabled()
	}));
}

export function useAnnouncementTagsQuery() {
	return createQuery<AnnouncementTag[], Error, AnnouncementTag[], readonly unknown[]>(() => queryOptions.announcementTags());
}

export function useHealthQuery() {
	return createQuery<boolean, Error, boolean, readonly unknown[]>(() => queryOptions.health());
}

export function useCreateAnnouncementMutation() {
	const queryClient = useQueryClient();

	return createMutation<Announcement, Error, AnnouncementPayload>(() => ({
		mutationFn: (payload: AnnouncementPayload) => createAnnouncement(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all() });
		}
	}));
}

export function useUpdateAnnouncementMutation() {
	const queryClient = useQueryClient();

	return createMutation<Announcement, Error, { id: number; payload: AnnouncementPayload }>(() => ({
		mutationFn: ({ id, payload }: { id: number; payload: AnnouncementPayload }) =>
			updateAnnouncement(id, payload),
		onSuccess: (data: Announcement, { id }: { id: number; payload: AnnouncementPayload }) => {
			queryClient.setQueryData(queryKeys.announcements.detail(id), data);
			queryClient.invalidateQueries({ queryKey: queryKeys.announcements.list() });
		}
	}));
}

export function useDeleteAnnouncementMutation() {
	const queryClient = useQueryClient();

	return createMutation<void, Error, number>(() => ({
		mutationFn: (id: number) => deleteAnnouncement(id),
		onSuccess: (_: void, id: number) => {
			queryClient.removeQueries({ queryKey: queryKeys.announcements.detail(id) });
			queryClient.invalidateQueries({ queryKey: queryKeys.announcements.list() });
		}
	}));
}

export function prefetchAnnouncement(queryClient: QueryClient, id: number) {
	return queryClient.prefetchQuery(queryOptions.announcementById(id));
}

