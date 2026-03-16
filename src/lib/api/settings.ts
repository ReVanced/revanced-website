import { browser } from '$app/environment';
import {
	RV_API_URL,
	RV_STATUS_URL,
	RV_EMAIL,
	RV_DMCA_GUID,
	RV_GOOGLE_TAG_MANAGER_ID
} from '$env/static/public';

const STATUS_KEY = 'revanced_status_url';
const EMAIL_KEY = 'revanced_email';

export const DEFAULT_API_URL = RV_API_URL;
export const DEFAULT_STATUS_URL = RV_STATUS_URL;
export const DEFAULT_EMAIL = RV_EMAIL;
export const DMCA_GUID = RV_DMCA_GUID;
export const GOOGLE_TAG_MANAGER_ID = RV_GOOGLE_TAG_MANAGER_ID;

const API_VERSION = 'v5';

export function populateDynamicSettings(
	aboutData: { status?: string; contact?: { email?: string } } | null
): void {
	if (!browser || !aboutData) return;
	if (!localStorage.getItem(STATUS_KEY) && aboutData.status) {
		localStorage.setItem(STATUS_KEY, aboutData.status);
	}
	if (!localStorage.getItem(EMAIL_KEY) && aboutData.contact?.email) {
		localStorage.setItem(EMAIL_KEY, aboutData.contact.email);
	}
}

export function getStatusUrl(): string {
	if (browser) {
		const cached = localStorage.getItem(STATUS_KEY);
		if (cached) return cached;
	}
	return DEFAULT_STATUS_URL;
}

export function getContactEmail(): string {
	if (browser) {
		const cached = localStorage.getItem(EMAIL_KEY);
		if (cached) return cached;
	}
	return DEFAULT_EMAIL;
}

export function clearCacheAndReload(): void {
	if (!browser) return;

	localStorage.clear();
	sessionStorage.clear();

	sessionStorage.setItem('revanced_intentional_logout', 'true');
	location.reload();
}

export function buildUrl(endpoint: string): string {
	endpoint = endpoint.replace(/^\/+/, '');
	if (endpoint.startsWith(API_VERSION)) {
		endpoint = endpoint.split('/').slice(1).join('/');
	}

	return `${DEFAULT_API_URL}/${API_VERSION}/${endpoint}`;
}
