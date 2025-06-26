import { browser } from '$app/environment';
import { RV_API_URL, RV_EMAIL, RV_STATUS_URL } from '$env/static/public';

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
		const apiUrl = localStorage.getItem(URL_KEY) || default_api_url;

		set_about_info(apiUrl);

		return apiUrl;
	}

	return default_api_url;
}

export function status_url(): string {
	if (browser) {
		return localStorage.getItem(STATUS_KEY) || default_status_url;
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
		localStorage.setItem(URL_KEY, url);
		set_about_info(url);
	}
}

function set_about_info(apiUrl: string) {
	if (!localStorage.getItem(STATUS_KEY) || !localStorage.getItem(EMAIL_KEY)) {
		fetch(`${apiUrl}/v4/about`)
			.then((response) => (response.ok ? response.json() : null))
			.then((data) => {
				if (data?.status) {
					localStorage.setItem(STATUS_KEY, data.status);
					localStorage.setItem(EMAIL_KEY, data.contact.email);
					console.log('Status is now:', localStorage.getItem(STATUS_KEY));
					console.log('Email is now:', localStorage.getItem(EMAIL_KEY));
				}
			});
	}
}
