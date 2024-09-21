import { browser } from '$app/environment';
import { RV_API_URL } from '$env/static/public';
import { type AuthToken } from '$lib/auth';

const URL_KEY = 'revanced_api_url';

export const default_base_url = RV_API_URL;

// Get base URL
export function api_base_url(): string {
	if (browser) return localStorage.getItem(URL_KEY) || default_base_url;
	return default_base_url;
}

// (Re)set base URL.
export function set_api_base_url(url?: string) {
	if (!url) localStorage.removeItem(URL_KEY);
	else localStorage.setItem(URL_KEY, url);
}

// Get access token.
export function get_access_token(): AuthToken | null {
	const data = localStorage.getItem('revanced_api_access_token');
	if (browser && data) return JSON.parse(data) as AuthToken;
	return null;
}

// (Re)set access token.
export function set_access_token(token?: AuthToken) {
	if (!token) localStorage.removeItem('revanced_api_access_token');
	else localStorage.setItem('revanced_api_access_token', JSON.stringify(token));
}
