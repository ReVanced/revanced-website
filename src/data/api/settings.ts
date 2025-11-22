import { browser } from '$app/environment';
import { RV_API_URL, RV_EMAIL, RV_STATUS_URL } from '../../env/static/public'; // Attention needed here, changed import paths

export const default_api_url = RV_API_URL;
export const default_status_url = RV_STATUS_URL;
export const default_email = RV_EMAIL;

const URL_KEY = 'revanced_api_url';
const STATUS_KEY = 'revanced_status_url';
const EMAIL_KEY = 'revanced_email';

export const API_VERSION = 'v4';

// Get base URL
export function api_base_url(): string {
	if (browser) {
		try {
			const url = localStorage.getItem(URL_KEY);
			if (url) {
				return url;
			}
		} catch (error) {
			console.error('Failed to get API URL from localStorage:', error);
		}
	}

	return default_api_url;
}

export function status_url(): string {
	if (browser) {
		try {
			return localStorage.getItem(STATUS_KEY) || default_status_url;
		} catch (error) {
			console.error('Failed to get status URL from localStorage:', error);
			return default_status_url;
		}
	}

	return default_status_url;
}

export function email(): string {
	if (browser) {
		try {
			return localStorage.getItem(EMAIL_KEY) || default_email;
		} catch (error) {
			console.error('Failed to get email from localStorage:', error);
			return default_email;
		}
	}

	return default_email;
}

// (re)set base URL.
export function set_api_base_url(url?: string) {
	if (!browser) return;

	try {
		if (!url) {
			localStorage.removeItem(URL_KEY);
		} else {
			localStorage.setItem(URL_KEY, url);
		}
		set_about_info(api_base_url());
	} catch (error) {
		console.error('Failed to set API URL:', error);
	}
}

let aboutInfoFetching = false;

export function set_about_info(apiUrl: string) {
	if (!browser || aboutInfoFetching) return;

	try {
		const hasStatus = localStorage.getItem(STATUS_KEY);
		const hasEmail = localStorage.getItem(EMAIL_KEY);

		if (!hasStatus || !hasEmail) {
			aboutInfoFetching = true;
			fetch(`${apiUrl}/v4/about`)
				.then((response) => (response.ok ? response.json() : null))
				.then((data) => {
					if (data?.status) {
						try {
							localStorage.setItem(STATUS_KEY, data.status);
							localStorage.setItem(EMAIL_KEY, data.contact.email);
						} catch (error) {
							console.error('Failed to save about info to localStorage:', error);
						}
					}
				})
				.catch((error) => {
					console.error('Failed to fetch about info:', error);
				})
				.finally(() => {
					aboutInfoFetching = false;
				});
		}
	} catch (error) {
		console.error('Failed to check about info:', error);
		aboutInfoFetching = false;
	}
}
