import { browser, dev } from '$app/environment';

export const DEFAULT_API_URL = 'https://api.revanced.app';
export const DEFAULT_STATUS_URL = 'https://status.revanced.app';
export const DEFAULT_EMAIL = 'contact@revanced.app';

const DEV_PROXY_URL = '/api/revanced';
// to be removed in production
const API_VERSION = 'v4';
const URL_KEY = 'revanced_api_url';

export function getStatusUrl(): string {
	return DEFAULT_STATUS_URL;
}


export function getContactEmail(): string {
	return DEFAULT_EMAIL;
}

export function getApiBaseUrl(): string {
	if (browser) {
		const customUrl = localStorage.getItem(URL_KEY);
		if (customUrl) return customUrl;
		
		// In development, use proxy to bypass CORS
		if (dev) return DEV_PROXY_URL;
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
	
	if (!url) {
		localStorage.removeItem(URL_KEY);
	} else {
		localStorage.setItem(URL_KEY, url);
	}
}

export function clearCacheAndReload(): void {
	if (!browser) return;
	
	localStorage.clear();

	location.reload();
}

export function buildUrl(endpoint: string): string {
	endpoint = endpoint.replace(/^\/+/, '');
	if (endpoint.startsWith(API_VERSION)) {
		endpoint = endpoint.split('/').slice(1).join('/');
	}
	
	return `${getApiBaseUrl()}/${API_VERSION}/${endpoint}`;
}
