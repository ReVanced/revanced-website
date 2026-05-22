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
import { createStorageFromPlatform, type Storage } from './storage';
import type { z } from 'zod';

const CACHE_TTL_SECONDS = 300;
const MAX_RETRIES = 3;
const FALLBACK_STORAGE_KEY = 'fallback';

const CACHE_INIT = {
	cf: { cacheTtlByStatus: { '200-299': CACHE_TTL_SECONDS } }
} as RequestInit;

async function fetchWithRetries(url: string, fetchFn: typeof fetch): Promise<Response> {
	let lastError: unknown;
	for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
		try {
			return await fetchFn(url, CACHE_INIT);
		} catch (err) {
			lastError = err;
		}
	}
	throw lastError;
}

async function getServerActiveUrls(
	storage: Storage | null
): Promise<{ primary: string; fallback: string | null }> {
	const envFallback = RV_API_URL_FALLBACK || null;
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

async function resilientFetch(
	endpoint: string,
	fetchFn: typeof fetch,
	storage: Storage | null
): Promise<Response> {
	const { primary, fallback } = await getServerActiveUrls(storage);
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
	fetchFn: typeof fetch = fetch,
	storage: Storage | null = null
): Promise<T> {
	const response = await resilientFetch(endpoint, fetchFn, storage);

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

export async function fetchAbout(
	fetchFn?: typeof fetch,
	platform?: App.Platform
): Promise<About> {
	const storage = createStorageFromPlatform(platform);
	const about = await fetchJsonServer('about', AboutSchema, fetchFn, storage);

	if (storage) {
		try {
			if (about.fallback === null) {
				await storage.delete(FALLBACK_STORAGE_KEY);
			} else if (about.fallback !== undefined) {
				await storage.set(FALLBACK_STORAGE_KEY, JSON.stringify(about.fallback));
			}
		} catch {
			// persistence failures must not break /about
		}
	}

	return about;
}

export async function fetchLatestAnnouncements(
	fetchFn?: typeof fetch,
	platform?: App.Platform
): Promise<TaggedLatestAnnouncements[]> {
	const storage = createStorageFromPlatform(platform);
	return fetchJsonServer('announcements/latest', LatestAnnouncementsSchema, fetchFn, storage);
}

export async function fetchTeam(
	fetchFn?: typeof fetch,
	platform?: App.Platform
): Promise<TeamMember[]> {
	const storage = createStorageFromPlatform(platform);
	return fetchJsonServer('team', TeamMembersSchema, fetchFn, storage);
}

export async function fetchManager(
	fetchFn?: typeof fetch,
	platform?: App.Platform
): Promise<ManagerRelease> {
	const storage = createStorageFromPlatform(platform);
	return fetchJsonServer('manager', ManagerReleaseSchema, fetchFn, storage);
}

export async function fetchContributors(
	fetchFn?: typeof fetch,
	platform?: App.Platform
): Promise<Contributable[]> {
	const storage = createStorageFromPlatform(platform);
	return fetchJsonServer('contributors', ContributablesSchema, fetchFn, storage);
}

export async function fetchAnnouncements(
	fetchFn?: typeof fetch,
	platform?: App.Platform
): Promise<Announcement[]> {
	const storage = createStorageFromPlatform(platform);
	return fetchJsonServer('announcements', AnnouncementsSchema, fetchFn, storage);
}
