import { browser, dev } from '$app/environment'; // Ta bort senare
import { RV_API_URL, RV_EMAIL, RV_STATUS_URL } from './public'; // Was previously $env/static/public but for some reason this caused issues of not finding or being able to read the variables in .env

export const default_api_url = (browser && dev) ? '/api' : RV_API_URL; // Attention needed here, there were some 403 in the browser so the following was modified to how it is now, might not work in Production Environment but works in Development Environment
export const default_status_url = RV_STATUS_URL;
export const default_email = RV_EMAIL;

const URL_KEY = 'revanced_api_url';
const STATUS_KEY = 'revanced_status_url';
const EMAIL_KEY = 'revanced_email';

export const API_VERSION = 'v4';

export function api_base_url(): string {
	if (browser) {
		const apiUrl = localStorage.getItem(URL_KEY) || default_api_url;

		return apiUrl;
	}

	return default_api_url;
}

export function status_url(): string {
	if (browser) {
		const url = localStorage.getItem(STATUS_KEY) || default_status_url;
		try {
			const parsed = new URL(url);
			if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
				return url;
			}
		} catch {
		}
		return default_status_url;
	}

	return default_status_url;
}

export function email(): string {
	if (browser) {
		return localStorage.getItem(EMAIL_KEY) || default_email;
	}

	return default_email;
}

// (re)set base URL.
export function set_api_base_url(url?: string) {
	if (!url) {
		localStorage.removeItem(URL_KEY);
	} else {
		// Validate URL before setting
		try {
			const parsed = new URL(url, 'http://localhost');
			if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
				localStorage.setItem(URL_KEY, url);
			}
		} catch {
			console.error('Invalid API URL provided');
			return;
		}
	}
	set_about_info(api_base_url());
}

export async function set_about_info(apiUrl: string) {
	if (!localStorage.getItem(STATUS_KEY) || !localStorage.getItem(EMAIL_KEY)) {
		try {
			const response = await fetch(`${apiUrl}/v4/about`);
			const data = response.ok ? await response.json() : null;

			if (data?.status) {
				try {
					const parsed = new URL(data.status);
					if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
						localStorage.setItem(STATUS_KEY, data.status);
					}
				} catch {
					console.warn('Invalid status URL received from API');
				}

				localStorage.setItem(EMAIL_KEY, data.contact.email);
				console.log('Status is now:', localStorage.getItem(STATUS_KEY));
				console.log('Email is now:', localStorage.getItem(EMAIL_KEY));
			}
		} catch (error) {
			console.error('Failed to fetch about info:', error);
		}
	}
}
