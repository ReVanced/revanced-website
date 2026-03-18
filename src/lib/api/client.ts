import { buildUrl } from './settings';
import { getToken, isLoggedIn } from './auth';
import type {
	About,
	TeamMember,
	ManagerRelease,
	Contributable,
	Announcement,
	LatestAnnouncementId,
	TaggedLatestAnnouncements
} from './types';
import {
	AboutSchema,
	TeamMembersSchema,
	ManagerReleaseSchema,
	ContributablesSchema,
	AnnouncementsSchema,
	AnnouncementSchema,
	LatestAnnouncementIdsSchema,
	LatestAnnouncementsSchema
} from './schemas';
import type { z } from 'zod';

class ApiValidationError extends Error {
	constructor(
		endpoint: string,
		public readonly issues: z.ZodIssue[]
	) {
		super(`Invalid response from ${endpoint}. Please try again later.`);
		this.name = 'ApiValidationError';
	}
}

async function fetchJson<T>(
	endpoint: string,
	schema: z.ZodType<T>,
	signal?: AbortSignal
): Promise<T> {
	const response = await fetch(buildUrl(endpoint), {
		cache: 'no-store',
		...(signal ? { signal } : {})
	});
	if (!response.ok) {
		throw new Error(`API error: ${response.status} ${response.statusText}`);
	}
	const data = await response.json();

	// Validate with Zod
	const result = schema.safeParse(data);
	if (!result.success) {
		console.error(`[API] Validation failed for ${endpoint}:`, result.error.issues);
		throw new ApiValidationError(endpoint, result.error.issues);
	}
	return result.data;
}

function buildAuthHeaders(): Record<string, string> {
	const token = getToken();
	return {
		'Content-Type': 'application/json',
		...(token ? { Authorization: `Bearer ${token}` } : {})
	};
}

type HttpMethod = 'POST' | 'PATCH' | 'DELETE';

async function mutateJson<T>(
	method: HttpMethod,
	endpoint: string,
	body?: unknown,
	schema?: z.ZodType<T>
): Promise<T | null> {
	if (!isLoggedIn()) throw new Error('Unauthenticated');

	const response = await fetch(buildUrl(endpoint), {
		method,
		headers: buildAuthHeaders(),
		...(body !== undefined ? { body: JSON.stringify(body) } : {})
	});

	if (!response.ok) {
		throw new Error(`API error: ${response.status} ${response.statusText}`);
	}

	if (response.status === 204 || response.headers.get('content-length') === '0') {
		return null;
	}

	const data = await response.json();

	if (schema) {
		const result = schema.safeParse(data);
		if (!result.success) {
			console.error(`[API] Validation failed for ${method} ${endpoint}:`, result.error.issues);
			throw new ApiValidationError(endpoint, result.error.issues);
		}
		return result.data;
	}

	return data as T;
}

export async function fetchAbout(): Promise<About> {
	return fetchJson<About>('about', AboutSchema);
}

export async function fetchTeam(): Promise<TeamMember[]> {
	return fetchJson<TeamMember[]>('team', TeamMembersSchema);
}

export async function fetchManager(): Promise<ManagerRelease> {
	return fetchJson<ManagerRelease>('manager', ManagerReleaseSchema);
}

export async function fetchContributors(): Promise<Contributable[]> {
	return fetchJson<Contributable[]>('contributors', ContributablesSchema);
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
	return fetchJson<Announcement[]>('announcements', AnnouncementsSchema);
}

export async function fetchLatestAnnouncementIds(
	signal?: AbortSignal
): Promise<LatestAnnouncementId[]> {
	return fetchJson<LatestAnnouncementId[]>(
		'announcements/latest/id',
		LatestAnnouncementIdsSchema,
		signal
	);
}

export async function fetchLatestAnnouncements(
	signal?: AbortSignal
): Promise<TaggedLatestAnnouncements[]> {
	return fetchJson<TaggedLatestAnnouncements[]>(
		'announcements/latest',
		LatestAnnouncementsSchema,
		signal
	);
}

export async function fetchAnnouncementById(
	id: number,
	signal?: AbortSignal
): Promise<Announcement> {
	const all = await fetchJson<Announcement[]>('announcements', AnnouncementsSchema, signal);
	const found = all.find((a) => a.id === id);
	if (!found) throw new Error('API error: 404 Not Found');
	return found;
}

export type AnnouncementPayload = {
	title: string;
	content?: string;
	author?: string;
	tags?: string[];
	created_at?: string;
	archived_at?: string | null;
	level?: number;
};

export async function createAnnouncement(announcement: AnnouncementPayload): Promise<Announcement> {
	const result = await mutateJson<Announcement>(
		'POST',
		'announcements',
		announcement,
		AnnouncementSchema
	);
	if (!result) throw new Error('Failed to create announcement');
	return result;
}

export async function updateAnnouncement(
	id: number,
	announcement: AnnouncementPayload
): Promise<Announcement> {
	const result = await mutateJson<Announcement>(
		'PATCH',
		`announcements/${id}`,
		announcement,
		AnnouncementSchema
	);
	if (!result) throw new Error('Failed to update announcement');
	return result;
}

export async function deleteAnnouncement(id: number): Promise<void> {
	await mutateJson('DELETE', `announcements/${id}`);
}
