import { browser } from '$app/environment';
import { buildUrl } from './settings';

const TOKEN_KEY = 'revanced_api_access_token';

export type AuthToken = {
	token: string;
	expires: number;
};

type JwtPayload = {
	exp: number;
	iss: string;
	iat: number;
};

function parseJwt(token: string): JwtPayload {
	const base64Url = token.split('.')[1];
	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	const decoded = decodeURIComponent(
		atob(base64)
			.split('')
			.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
			.join('')
	);
	return JSON.parse(decoded);
}

function getStoredToken(): AuthToken | null {
	if (!browser) return null;
	const raw = localStorage.getItem(TOKEN_KEY);
	if (!raw) return null;
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

function storeToken(token: AuthToken | null): void {
	if (!browser) return;
	if (token) {
		localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
	} else {
		localStorage.removeItem(TOKEN_KEY);
	}
}

export function isLoggedIn(): boolean {
	const token = getStoredToken();
	if (!token) return false;
	return Date.now() < token.expires;
}

export function getToken(): string | null {
	const stored = getStoredToken();
	if (!stored || Date.now() >= stored.expires) return null;
	return stored.token;
}

export function getTokenExpiry(): number | null {
	const stored = getStoredToken();
	return stored?.expires ?? null;
}

export function logout(): void {
	storeToken(null);
}

async function digestAuth(
	url: string,
	username: string,
	password: string
): Promise<Response> {
	async function sha256(msg: string): Promise<string> {
		const data = new TextEncoder().encode(msg);
		const hash = await crypto.subtle.digest('SHA-256', data);
		return Array.from(new Uint8Array(hash))
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');
	}

	// first request to get the challenge
	const initial = await fetch(url, { method: 'GET' });

	if (initial.ok) return initial;
	if (initial.status !== 401) {
		throw new Error(`Unexpected status: ${initial.status}`);
	}

	const wwwAuth = initial.headers.get('Www-Authenticate');
	if (!wwwAuth?.startsWith('Digest ')) {
		throw new Error('Server does not support digest auth');
	}

	// parse challenge params
	const params: Record<string, string> = {};
	wwwAuth
		.slice(7)
		.split(',')
		.forEach((part) => {
			const idx = part.indexOf('=');
			if (idx > 0) {
				const key = part.slice(0, idx).trim();
				const val = part.slice(idx + 1).trim().replace(/"/g, '');
				params[key] = val;
			}
		});

	const { realm, nonce, algorithm } = params;
	const uri = new URL(url).pathname;

	// compute digest response
	const ha1 = await sha256(`${username}:${realm}:${password}`);
	const ha2 = await sha256(`GET:${uri}`);
	const response = await sha256(`${ha1}:${nonce}:${ha2}`);

	const authHeader = [
		`Digest username="${username}"`,
		`realm="${realm}"`,
		`nonce="${nonce}"`,
		`uri="${uri}"`,
		`algorithm=${algorithm}`,
		`response="${response}"`
	].join(', ');

	return fetch(url, {
		method: 'GET',
		headers: { Authorization: authHeader }
	});
}

export type LoginResult =
	| { success: true }
	| { success: false; error: string };

export async function login(username: string, password: string): Promise<LoginResult> {
	try {
		const res = await digestAuth(buildUrl('token'), username, password);

		if (!res.ok) {
			if (res.status === 401) {
				return { success: false, error: 'Invalid credentials' };
			}
			return { success: false, error: `Server error (${res.status})` };
		}

		const data = await res.json();
		if (!data.token) {
			return { success: false, error: 'Invalid response from server' };
		}

		const payload = parseJwt(data.token);
		storeToken({
			token: data.token,
			expires: payload.exp * 1000
		});

		return { success: true };
	} catch (err) {
		const msg = err instanceof Error ? err.message : 'Unknown error';
		return { success: false, error: msg };
	}
}
