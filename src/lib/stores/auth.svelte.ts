import { browser } from '$app/environment';
import { isLoggedIn, logout as doLogout, login as doLogin } from '$api/auth';
import type { LoginResult } from '$api/auth';

function createAuthStore() {
	let loggedIn = $state(false);
	let loginModalRequested = $state(false);
	let loginSuccess = $state(false);
	let initialized = $state(false);

	function refresh() {
		loggedIn = isLoggedIn();
	}

	function startChecking() {
		if (!browser) return;
		initialized = true;
		refresh();
	}

	function stopChecking() {
		// No-op: static tokens don't expire
	}

	function login(token: string): LoginResult {
		const result = doLogin(token);
		if (result.success) {
			loginSuccess = true;
			refresh();
		}
		return result;
	}

	function logout() {
		doLogout();
		refresh();
	}

	function clearSessionExpired() {
		// No-op: static tokens don't expire
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
		get isInitialized() {
			return initialized;
		},
		get sessionExpired() {
			return false;
		},
		get expiry() {
			return null;
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
