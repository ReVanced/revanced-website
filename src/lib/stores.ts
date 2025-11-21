import { readable, writable } from 'svelte/store';
import { is_logged_in, get_access_token } from './auth';
import { browser } from '$app/environment';

type AdminLoginInfo =
	| {
			logged_in: true;
			expires: number;
			logged_in_previously: boolean;
	  }
	| {
			logged_in: false;
			expires: undefined;
			logged_in_previously: boolean;
	  };

const admin_login_info = (): AdminLoginInfo => {
	const token = get_access_token();
	if (token && is_logged_in())
		return {
			logged_in: true,
			expires: token.expires,
			logged_in_previously: !!token.token
		};
	else
		return {
			logged_in: false,
			expires: undefined,
			logged_in_previously: !!token?.token
		};
};

export const admin_login = readable<AdminLoginInfo>(admin_login_info(), (set) => {
	const checkLoginStatus = () => set(admin_login_info());

	checkLoginStatus();

	// Reduced from 1 second to 30 seconds to prevent battery drain
	const interval = setInterval(checkLoginStatus, 30000);
	return () => clearInterval(interval);
});

export const read_announcements = writable<Set<number>>(new Set(), (set) => {
	if (!browser) return;

	const key = 'read_announcements';
	try {
		const data = localStorage.getItem(key);
		const parsedArray: number[] = data ? JSON.parse(data) : [];
		const currentState = new Set<number>(parsedArray);

		const updateStoreState = () => {
			set(currentState);
		};

		const handleLocalStorageUpdate = (e: StorageEvent) => {
			if (e.key === key) {
				try {
					const newData = e.newValue ? JSON.parse(e.newValue) : [];
					set(new Set<number>(newData));
				} catch (error) {
					console.error('Failed to parse localStorage update:', error);
				}
			}
		};

		window.addEventListener('storage', handleLocalStorageUpdate);
		updateStoreState();

		// Subscribe to changes and persist to localStorage
		const unsubscribe = read_announcements.subscribe((value) => {
			try {
				localStorage.setItem(key, JSON.stringify(Array.from(value)));
			} catch (error) {
				console.error('Failed to save to localStorage:', error);
			}
		});

		return () => {
			window.removeEventListener('storage', handleLocalStorageUpdate);
			unsubscribe();
		};
	} catch (error) {
		console.error('Failed to initialize read_announcements:', error);
		// Return no-op cleanup function
		return () => {};
	}
});

export const passed_login_with_creds = writable(false); // will only change when the user INPUTS the credentials, not if the session is just valid

export const allowAnalytics = writable(false);
