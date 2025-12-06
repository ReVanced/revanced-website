import { browser } from '$app/environment';
import { isLoggedIn, getTokenExpiry, logout as doLogout, login as doLogin } from '$api/auth';
import type { LoginResult } from '$api/auth';

function createAuthStore() {
	let loggedIn = $state(false);
	let wasLoggedIn = $state(false);
	let expiry = $state<number | null>(null);
	let loginModalRequested = $state(false);
	let checkInterval: ReturnType<typeof setInterval> | null = null;

	function refresh() {
		const currentlyLoggedIn = isLoggedIn();
		if (loggedIn && !currentlyLoggedIn) {
			wasLoggedIn = true;
		}
		
		loggedIn = currentlyLoggedIn;
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
			wasLoggedIn = false;
			refresh();
		}
		return result;
	}

	function logout() {
		doLogout();
		wasLoggedIn = false;
		refresh();
	}

	function clearSessionExpired() {
		wasLoggedIn = false;
	}

	function requestLoginModal() {
		loginModalRequested = true;
	}

	function clearLoginModalRequest() {
		loginModalRequested = false;
	}

	return {
		get isLoggedIn() {
			return loggedIn;
		},
		get sessionExpired() {
			return wasLoggedIn && !loggedIn;
		},
		get expiry() {
			return expiry;
		},
		get loginModalRequested() {
			return loginModalRequested;
		},
		login,
		logout,
		refresh,
		startChecking,
		stopChecking,
		clearSessionExpired,
		requestLoginModal,
		clearLoginModalRequest
	};
}

export const auth = createAuthStore();
