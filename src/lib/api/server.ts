import { RV_API_URL } from '$env/static/public';
import type {
	About,
	TeamMember,
	ManagerRelease,
	Contributable,
	Announcement,
	TaggedLatestAnnouncements
} from './types';
import {
	AboutSchema,
	TeamMembersSchema,
	ManagerReleaseSchema,
	ContributablesSchema,
	AnnouncementsSchema,
	LatestAnnouncementsSchema
} from './schemas';
import type { z } from 'zod';

const API_VERSION = 'v5';
const DEFAULT_MAX_AGE_SECONDS = 300;

function buildServerUrl(endpoint: string): string {
	endpoint = endpoint.replace(/^\/+/, '');
	return `${RV_API_URL}/${API_VERSION}/${endpoint}`;
}

async function fetchWithEdgeCache(url: string, fetchFn: typeof fetch): Promise<Response> {
	const cache = (globalThis as { caches?: { default?: Cache } }).caches?.default;
	if (!cache) return fetchFn(url);

	const cacheKey = new Request(url);
	const cached = await cache.match(cacheKey);
	if (cached) return cached;

	const fresh = await fetchFn(url);
	if (!fresh.ok) return fresh;

	const cc = fresh.headers.get('Cache-Control') ?? '';
	if (/\bno-store\b/i.test(cc)) return fresh;

	if (/\bmax-age\b/i.test(cc)) {
		await cache.put(cacheKey, fresh.clone());
	} else {
		const body = await fresh.clone().arrayBuffer();
		const headers = new Headers(fresh.headers);
		headers.set('Cache-Control', `public, max-age=${DEFAULT_MAX_AGE_SECONDS}`);
		await cache.put(
			cacheKey,
			new Response(body, { status: fresh.status, statusText: fresh.statusText, headers })
		);
	}
	return fresh;
}

async function fetchJsonServer<T>(
	endpoint: string,
	schema: z.ZodType<T>,
	fetchFn: typeof fetch = fetch
): Promise<T> {
	const url = buildServerUrl(endpoint);
	const response = await fetchWithEdgeCache(url, fetchFn);

	if (!response.ok) {
		throw new Error(`API error: ${response.status} ${response.statusText}`);
	}

	const data = await response.json();
	const result = schema.safeParse(data);
	if (!result.success) {
		console.error(`Validation failed for ${endpoint}:`, result.error.issues);
		throw new Error(`Invalid response from ${endpoint}`);
	}
	return result.data;
}

export async function fetchAbout(fetchFn?: typeof fetch): Promise<About> {
	return fetchJsonServer('about', AboutSchema, fetchFn);
}

export async function fetchTeam(fetchFn?: typeof fetch): Promise<TeamMember[]> {
	return fetchJsonServer('team', TeamMembersSchema, fetchFn);
}

export async function fetchManager(fetchFn?: typeof fetch): Promise<ManagerRelease> {
	return fetchJsonServer('manager', ManagerReleaseSchema, fetchFn);
}

export async function fetchContributors(fetchFn?: typeof fetch): Promise<Contributable[]> {
	return fetchJsonServer('contributors', ContributablesSchema, fetchFn);
}

export async function fetchAnnouncements(fetchFn?: typeof fetch): Promise<Announcement[]> {
	return fetchJsonServer('announcements', AnnouncementsSchema, fetchFn);
}

export async function fetchLatestAnnouncements(
	fetchFn?: typeof fetch
): Promise<TaggedLatestAnnouncements[]> {
	return fetchJsonServer('announcements/latest', LatestAnnouncementsSchema, fetchFn);
}
