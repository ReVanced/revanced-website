import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';

function requireEnv(key: `RV_${string}`): string {
	const value = env[key];
	if (value === undefined) {
		throw new Error(
			`Missing environment variable "${key}". ` +
			`Make sure a .env file exists in the project root with "${key}" defined. ` +
			`See .env.example for reference.`
		);
	}
	return value;
}

const URL_KEY = 'revanced_api_url';
const STATUS_KEY = 'revanced_status_url';
const EMAIL_KEY = 'revanced_email';

export const DEFAULT_API_URL = requireEnv('RV_API_URL');
export const DEFAULT_STATUS_URL = requireEnv('RV_STATUS_URL');
export const DEFAULT_EMAIL = requireEnv('RV_EMAIL');
export const DMCA_GUID = requireEnv('RV_DMCA_GUID');
export const GOOGLE_TAG_MANAGER_ID = requireEnv('RV_GOOGLE_TAG_MANAGER_ID');

const API_VERSION = 'v5';
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
	
	sessionStorage.setItem('revanced_intentional_logout', 'true');
	location.reload();
}

export function buildUrl(endpoint: string): string {
	endpoint = endpoint.replace(/^\/+/, '');
	if (endpoint.startsWith(API_VERSION)) {
		endpoint = endpoint.split('/').slice(1).join('/');
	}
	
	return `${getApiBaseUrl()}/${API_VERSION}/${endpoint}`;
}
