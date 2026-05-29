import { browser } from '$app/environment';
import {
	RV_API_URL,
	RV_API_URL_FALLBACK,
	RV_STATUS_URL,
	RV_EMAIL,
	RV_DMCA_GUID,
	RV_GOOGLE_TAG_MANAGER_ID
} from '$env/static/public';
import { parseStoredFallback, resolveActiveUrls, type StoredFallback } from './storage';

const FALLBACK_KEY = 'revanced_api_fallback';
const LEGACY_FALLBACK_URL_KEY = 'revanced_api_url_fallback';

export const DEFAULT_API_URL = RV_API_URL;
export const DEFAULT_API_URL_FALLBACK = RV_API_URL_FALLBACK;
export const DEFAULT_STATUS_URL = RV_STATUS_URL;
export const DEFAULT_EMAIL = RV_EMAIL;
export const DMCA_GUID = RV_DMCA_GUID;
export const GOOGLE_TAG_MANAGER_ID = RV_GOOGLE_TAG_MANAGER_ID;

export const API_VERSION = 'v5';

function setStorage(key: string, value: string | null | undefined): void {
	if (!browser) return;
	if (value) {
		localStorage.setItem(key, value);
	} else {
		localStorage.removeItem(key);
	}
}

function readInitialStoredFallback(): StoredFallback | null {
	if (!browser) return null;

	const legacy = localStorage.getItem(LEGACY_FALLBACK_URL_KEY);
	if (legacy !== null) {
		localStorage.removeItem(LEGACY_FALLBACK_URL_KEY);
		if (legacy) {
			const migrated: StoredFallback = { url: legacy, recover: true };
			setStorage(FALLBACK_KEY, JSON.stringify(migrated));
			return migrated;
		}
	}

	return parseStoredFallback(localStorage.getItem(FALLBACK_KEY));
}

let storedFallback: StoredFallback | null = readInitialStoredFallback();

function writeStoredFallback(fallback: StoredFallback | null): void {
	storedFallback = fallback;
	setStorage(FALLBACK_KEY, fallback ? JSON.stringify(fallback) : null);
}

export function populateDynamicSettings(
	aboutData: { fallback?: { url: string | null; recover: boolean } | null } | null
): void {
	if (!browser || !aboutData) return;
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
	return resolveActiveUrls(storedFallback, DEFAULT_API_URL, DEFAULT_API_URL_FALLBACK || null).primary;
}

export function getFallbackApiUrl(): string | null {
	return resolveActiveUrls(storedFallback, DEFAULT_API_URL, DEFAULT_API_URL_FALLBACK || null).fallback;
}

export function getStatusUrl(): string {
	return DEFAULT_STATUS_URL;
}

export function getContactEmail(): string {
	return DEFAULT_EMAIL;
}

export function clearCacheAndReload(): void {
	if (!browser) return;

	localStorage.clear();
	sessionStorage.clear();

	sessionStorage.setItem('revanced_intentional_logout', 'true');
	location.reload();
}

export function composeApiUrl(base: string, endpoint: string): string {
	return `${base}/${API_VERSION}/${endpoint}`;
}

export function buildUrl(endpoint: string): string {
	return composeApiUrl(getApiUrl(), endpoint);
}
