import { browser, dev } from '$app/environment';

export const DEFAULT_API_URL = 'https://api.revanced.app';
export const DEFAULT_STATUS_URL = 'https://status.revanced.app';
export const DEFAULT_EMAIL = 'contact@revanced.app';

const DEV_PROXY_URL = '/api/revanced';
// to be removed in production
const API_VERSION = 'v4';
const URL_KEY = 'revanced_api_url';
const STATUS_KEY = 'revanced_status_url';
const EMAIL_KEY = 'revanced_email';
let dynamicSettingsFetched = false;

export async function fetchDynamicSettings(): Promise<void> {
	if (!browser || dynamicSettingsFetched) return;
	dynamicSettingsFetched = true;
	if (localStorage.getItem(STATUS_KEY) && localStorage.getItem(EMAIL_KEY)) {
		return;
	}
	try {
		const response = await fetch(`${getApiBaseUrl()}/${API_VERSION}/about`);
		if (!response.ok) return;

		const data = await response.json();

		if (data?.status) {
			localStorage.setItem(STATUS_KEY, data.status);
		}
		if (data?.contact?.email) {
			localStorage.setItem(EMAIL_KEY, data.contact.email);
		}
	} catch {
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
	localStorage.removeItem(STATUS_KEY);
	localStorage.removeItem(EMAIL_KEY);
	dynamicSettingsFetched = false;
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
