import { browser } from '$app/environment';
import { isLoggedIn, getTokenExpiry, logout as doLogout, login as doLogin } from '$api/auth';
import type { LoginResult } from '$api/auth';

function createAuthStore() {
	let loggedIn = $state(false);
	let expiry = $state<number | null>(null);
	let checkInterval: ReturnType<typeof setInterval> | null = null;

	function refresh() {
		loggedIn = isLoggedIn();
		expiry = getTokenExpiry();
	}

	function startChecking() {
		if (!browser || checkInterval) return;
		refresh();
		// check every 10 seconds if token expired
		checkInterval = setInterval(refresh, 10_000);
	}

	function stopChecking() {
		if (checkInterval) {
			clearInterval(checkInterval);
			checkInterval = null;
		}
	}

	async function login(username: string, password: string): Promise<LoginResult> {
		const result = await doLogin(username, password);
		if (result.success) {
			refresh();
		}
		return result;
	}

	function logout() {
		doLogout();
		refresh();
	}

	return {
		get isLoggedIn() {
			return loggedIn;
		},
		get expiry() {
			return expiry;
		},
		login,
		logout,
		refresh,
		startChecking,
		stopChecking
	};
}

export const auth = createAuthStore();
