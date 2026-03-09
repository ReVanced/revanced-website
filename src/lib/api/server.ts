import { RV_API_URL } from '$env/static/public';
import type {
	About,
	TeamMember,
	ManagerRelease,
	Contributable,
	Announcement
} from './types';
import {
	AboutSchema,
	TeamMembersSchema,
	ManagerReleaseSchema,
	ContributablesSchema,
	AnnouncementsSchema
} from './schemas';
import type { z } from 'zod';

const API_VERSION = 'v5';

function buildServerUrl(endpoint: string): string {
	endpoint = endpoint.replace(/^\/+/, '');
	return `${RV_API_URL}/${API_VERSION}/${endpoint}`;
}

async function fetchJsonServer<T>(
	endpoint: string,
	schema: z.ZodType<T>,
	fetchFn: typeof fetch = fetch
): Promise<T> {
	const url = buildServerUrl(endpoint);
	const response = await fetchFn(url, { cache: 'no-store' });

	if (!response.ok) {
		throw new Error(`API error: ${response.status} ${response.statusText}`);
	}

	const data = await response.json();
	const result = schema.safeParse(data);
	if (!result.success) {
		console.error(`[API Server] Validation failed for ${endpoint}:`, result.error.issues);
		throw new Error(`Invalid response from ${endpoint}`);
	}
	return result.data;
}

export async function fetchAboutServer(fetchFn?: typeof fetch): Promise<About> {
	return fetchJsonServer('about', AboutSchema, fetchFn);
}

export async function fetchTeamServer(fetchFn?: typeof fetch): Promise<TeamMember[]> {
	return fetchJsonServer('team', TeamMembersSchema, fetchFn);
}

export async function fetchManagerServer(fetchFn?: typeof fetch): Promise<ManagerRelease> {
	return fetchJsonServer('manager', ManagerReleaseSchema, fetchFn);
}

export async function fetchContributorsServer(fetchFn?: typeof fetch): Promise<Contributable[]> {
	return fetchJsonServer('contributors', ContributablesSchema, fetchFn);
}

export async function fetchAnnouncementsServer(fetchFn?: typeof fetch): Promise<Announcement[]> {
	return fetchJsonServer('announcements', AnnouncementsSchema, fetchFn);
}
