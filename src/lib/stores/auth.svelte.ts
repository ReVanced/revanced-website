import { browser } from '$app/environment';
import { isLoggedIn, getTokenExpiry, logout as doLogout, login as doLogin } from '$api/auth';
import type { LoginResult } from '$api/auth';

function createAuthStore() {
	let loggedIn = $state(false);
	let wasLoggedIn = $state(false);
	let expiry = $state<number | null>(null);
	let loginModalRequested = $state(false);
	let loginSuccess = $state(false);
	let checkInterval: ReturnType<typeof setInterval> | null = null;
	let initialCheckDone = false;

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
		if (!initialCheckDone) {
			initialCheckDone = true;
			const storedExpiry = getTokenExpiry();
			if (storedExpiry !== null && Date.now() >= storedExpiry) {
				wasLoggedIn = true;
			}
		}
		
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
			loginSuccess = true;
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

	function clearLoginSuccess() {
		loginSuccess = false;
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
		get loginSuccess() {
			return loginSuccess;
		},
		login,
		logout,
		refresh,
		startChecking,
		stopChecking,
		clearSessionExpired,
		requestLoginModal,
		clearLoginModalRequest,
		clearLoginSuccess
	};
}

export const auth = createAuthStore();
