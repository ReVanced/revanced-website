import { browser } from '$app/environment';
import { RV_API_URL } from '$env/static/public';

export const default_api_url = RV_API_URL;

const URL_KEY = 'revanced_api_url';

export const API_VERSION = 'v4';

// Get base URL
export function api_base_url(): string {
	if (browser) {
		return localStorage.getItem(URL_KEY) || default_api_url;
	}

	return default_api_url;
}

// (Re)set base URL.
export function set_api_base_url(url?: string) {
	if (!url) localStorage.removeItem(URL_KEY);
	else localStorage.setItem(URL_KEY, url);
}
