import { browser } from '$app/environment';

const URL_KEY = 'revanced_api_url';
const STATUS_KEY = 'revanced_status_url';
const EMAIL_KEY = 'revanced_email';

const ENV_API_URL = import.meta.env.VITE_RV_API_URL;
const ENV_STATUS_URL = import.meta.env.VITE_RV_STATUS_URL;
const ENV_EMAIL = import.meta.env.VITE_RV_EMAIL;

export const DEFAULT_API_URL = ENV_API_URL || 'https://api.revanced.app';
export const DEFAULT_STATUS_URL = ENV_STATUS_URL || 'https://status.revanced.app';
export const DEFAULT_EMAIL = ENV_EMAIL || 'contact@revanced.app';

const API_VERSION = 'v4';
let dynamicSettingsFetched = false;

export function populateDynamicSettings(aboutData: { status?: string; contact?: { email?: string } } | null): void {
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

export function getApiBaseUrl(): string {
	if (browser) {
		const customUrl = localStorage.getItem(URL_KEY);
		if (customUrl) return customUrl;
	}
	return DEFAULT_API_URL;
}


export function getDisplayApiUrl(): string {
	if (browser) {
		const customUrl = localStorage.getItem(URL_KEY);
		if (customUrl) return customUrl;
	}
	return DEFAULT_API_URL;
}


export function setApiBaseUrl(url?: string): void {
	if (!browser) return;
	const currentUrl = localStorage.getItem(URL_KEY);
	const newUrl = url || null;
	const urlChanged = currentUrl !== newUrl;
	
	if (urlChanged) {
		sessionStorage.removeItem('revanced_api_access_token');
	}
	
	if (!url) {
		localStorage.removeItem(URL_KEY);
	} else {
		localStorage.setItem(URL_KEY, url);
	}
	localStorage.removeItem(STATUS_KEY);
	localStorage.removeItem(EMAIL_KEY);
	dynamicSettingsFetched = false;
}

export function clearCacheAndReload(): void {
	if (!browser) return;
	
	localStorage.clear();
	sessionStorage.clear();

	location.reload();
}

export function buildUrl(endpoint: string): string {
	endpoint = endpoint.replace(/^\/+/, '');
	if (endpoint.startsWith(API_VERSION)) {
		endpoint = endpoint.split('/').slice(1).join('/');
	}
	
	return `${getApiBaseUrl()}/${API_VERSION}/${endpoint}`;
}
