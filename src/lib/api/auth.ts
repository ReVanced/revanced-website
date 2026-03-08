import { browser } from '$app/environment';

const AUTH_TOKEN_KEY = 'revanced_api_access_token'; // not secret, just a KEY for sessionStorage

function getStoredToken(): string | null {
	if (!browser) return null;
	return sessionStorage.getItem(AUTH_TOKEN_KEY);
}

function storeToken(token: string | null): void {
	if (!browser) return;
	if (token) {
		sessionStorage.setItem(AUTH_TOKEN_KEY, token);
	} else {
		sessionStorage.removeItem(AUTH_TOKEN_KEY);
	}
}

export function isLoggedIn(): boolean {
	return getStoredToken() !== null;
}

export function getToken(): string | null {
	return getStoredToken();
}

export function logout(): void {
	storeToken(null);
}

export type LoginResult =
	| { success: true }
	| { success: false; error: string };

export function login(token: string): LoginResult {
	if (!token.trim()) {
		return { success: false, error: 'Token cannot be empty' };
	}

	storeToken(token.trim());
	return { success: true };
}
