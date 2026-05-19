import { browser } from '$app/environment';
import {
	RV_API_URL,
	RV_API_URL_FALLBACK,
	RV_STATUS_URL,
	RV_EMAIL,
	RV_DMCA_GUID,
	RV_GOOGLE_TAG_MANAGER_ID
} from '$env/static/public';

const STATUS_KEY = 'revanced_status_url';
const EMAIL_KEY = 'revanced_email';
const FALLBACK_KEY = 'revanced_api_fallback';
const LEGACY_FALLBACK_URL_KEY = 'revanced_api_url_fallback';

export const DEFAULT_API_URL = RV_API_URL;
export const DEFAULT_API_URL_FALLBACK = RV_API_URL_FALLBACK;
export const DEFAULT_STATUS_URL = RV_STATUS_URL;
export const DEFAULT_EMAIL = RV_EMAIL;
export const DMCA_GUID = RV_DMCA_GUID;
export const GOOGLE_TAG_MANAGER_ID = RV_GOOGLE_TAG_MANAGER_ID;

export const API_VERSION = 'v5';

function readLocal(key: string): string | null {
	if (!browser) return null;
	return localStorage.getItem(key);
}

function syncLocal(key: string, value: string | null | undefined): void {
	if (!browser) return;
	if (value) {
		localStorage.setItem(key, value);
	} else {
		localStorage.removeItem(key);
	}
}

type StoredFallback = { url: string | null; recover: boolean };

function readStoredFallback(): StoredFallback | null {
	if (!browser) return null;

	const legacy = localStorage.getItem(LEGACY_FALLBACK_URL_KEY);
	if (legacy !== null) {
		localStorage.removeItem(LEGACY_FALLBACK_URL_KEY);
		if (legacy) {
			const migrated: StoredFallback = { url: legacy, recover: true };
			writeStoredFallback(migrated);
			return migrated;
		}
	}

	const raw = localStorage.getItem(FALLBACK_KEY);
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw);
		if (typeof parsed === 'object' && parsed !== null) {
			return {
				url: typeof parsed.url === 'string' ? parsed.url : null,
				recover: parsed.recover !== false
			};
		}
	} catch {
		localStorage.removeItem(FALLBACK_KEY);
	}
	return null;
}

function writeStoredFallback(fallback: StoredFallback | null): void {
	if (!browser) return;
	if (fallback) {
		localStorage.setItem(FALLBACK_KEY, JSON.stringify(fallback));
	} else {
		localStorage.removeItem(FALLBACK_KEY);
	}
}

function getActiveUrls(): { primary: string; fallback: string | null } {
	const stored = readStoredFallback();
	const envFallback = DEFAULT_API_URL_FALLBACK || null;
	if (stored && stored.recover === false && stored.url) {
		return { primary: stored.url, fallback: null };
	}
	return { primary: DEFAULT_API_URL, fallback: stored?.url || envFallback };
}

export function populateDynamicSettings(
	aboutData: {
		status?: string;
		contact?: { email?: string };
		fallback?: { url: string | null; recover: boolean } | null;
	} | null
): void {
	if (!browser || !aboutData) return;
	syncLocal(STATUS_KEY, aboutData.status);
	syncLocal(EMAIL_KEY, aboutData.contact?.email);
	if (aboutData.fallback === null) {
		writeStoredFallback(null);
	} else if (aboutData.fallback !== undefined) {
		writeStoredFallback({
			url: aboutData.fallback.url ?? null,
			recover: aboutData.fallback.recover
		});
	}
}

export function getApiUrl(): string {
	return getActiveUrls().primary;
}

export function getFallbackApiUrl(): string | null {
	return getActiveUrls().fallback;
}

export function getStatusUrl(): string {
	return readLocal(STATUS_KEY) ?? DEFAULT_STATUS_URL;
}

export function getContactEmail(): string {
	return readLocal(EMAIL_KEY) ?? DEFAULT_EMAIL;
}

export function clearCacheAndReload(): void {
	if (!browser) return;

	localStorage.clear();
	sessionStorage.clear();

	sessionStorage.setItem('revanced_intentional_logout', 'true');
	location.reload();
}

export function composeApiUrl(base: string, endpoint: string): string {
	endpoint = endpoint.replace(/^\/+/, '');
	if (endpoint === API_VERSION || endpoint.startsWith(API_VERSION + '/')) {
		endpoint = endpoint.slice(API_VERSION.length).replace(/^\/+/, '');
	}
	return `${base}/${API_VERSION}/${endpoint}`;
}

export function buildUrl(endpoint: string): string {
	return composeApiUrl(getApiUrl(), endpoint);
}
