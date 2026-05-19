import { RV_API_URL, RV_API_URL_FALLBACK } from '$env/static/public';
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
import { composeApiUrl } from './settings';
import { getCurrentStorage } from './storage';
import type { z } from 'zod';

const DEFAULT_MAX_AGE_SECONDS = 300;
const MAX_RETRIES = 3;
const FALLBACK_STORAGE_KEY = 'fallback';

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

async function fetchWithRetries(url: string, fetchFn: typeof fetch): Promise<Response> {
	let lastError: unknown;
	for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
		try {
			return await fetchWithEdgeCache(url, fetchFn);
		} catch (err) {
			lastError = err;
		}
	}
	throw lastError;
}

async function getServerActiveUrls(): Promise<{ primary: string; fallback: string | null }> {
	const envFallback = RV_API_URL_FALLBACK || null;
	const storage = getCurrentStorage();
	if (!storage) return { primary: RV_API_URL, fallback: envFallback };

	let stored: { url: string | null; recover: boolean } | null = null;
	try {
		const raw = await storage.get(FALLBACK_STORAGE_KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			if (typeof parsed === 'object' && parsed !== null) {
				stored = {
					url: typeof parsed.url === 'string' ? parsed.url : null,
					recover: parsed.recover !== false
				};
			}
		}
	} catch {
	}

	if (stored && stored.recover === false && stored.url) {
		return { primary: stored.url, fallback: null };
	}
	return { primary: RV_API_URL, fallback: stored?.url || envFallback };
}

async function resilientFetch(endpoint: string, fetchFn: typeof fetch): Promise<Response> {
	const { primary, fallback } = await getServerActiveUrls();
	try {
		return await fetchWithRetries(composeApiUrl(primary, endpoint), fetchFn);
	} catch (primaryErr) {
		if (!fallback) throw primaryErr;
		return fetchWithRetries(composeApiUrl(fallback, endpoint), fetchFn);
	}
}

async function fetchJsonServer<T>(
	endpoint: string,
	schema: z.ZodType<T>,
	fetchFn: typeof fetch = fetch
): Promise<T> {
	const response = await resilientFetch(endpoint, fetchFn);

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
	const about = await fetchJsonServer('about', AboutSchema, fetchFn);

	const storage = getCurrentStorage();
	if (storage) {
		try {
			if (about.fallback === null) {
				await storage.delete(FALLBACK_STORAGE_KEY);
			} else if (about.fallback !== undefined) {
				await storage.set(FALLBACK_STORAGE_KEY, JSON.stringify(about.fallback));
			}
		} catch { // persistince failures must not break /about
		}
	}

	return about;
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
