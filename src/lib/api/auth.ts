import { browser } from '$app/environment';
import { buildUrl } from './settings';

const TOKEN_KEY = 'revanced_api_access_token';
const CHANNEL_NAME = 'revanced_auth_channel';

let authChannel: BroadcastChannel | null = null;

if (browser && typeof BroadcastChannel !== 'undefined') {
	authChannel = new BroadcastChannel(CHANNEL_NAME);
}

export type AuthToken = {
	token: string;
	expires: number;
};

type AuthMessage =
	| { type: 'login'; token: AuthToken }
	| { type: 'logout' }
	| { type: 'request_session' }
	| { type: 'session_response'; token: AuthToken | null };

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

function isValidToken(token: unknown): token is AuthToken {
	if (!token || typeof token !== 'object') return false;
	const t = token as Partial<AuthToken>;
	
	if (typeof t.token !== 'string' || typeof t.expires !== 'number') return false;
	
	const parts = t.token.split('.');
	if (parts.length !== 3) return false;
	try {
		const payload = parseJwt(t.token);
		if (Math.abs(payload.exp * 1000 - t.expires) > 1000) return false;
	} catch {
		return false;
	}
	if (Date.now() >= t.expires) return false;
	
	return true;
}

function isValidAuthMessage(data: unknown): data is AuthMessage {
	if (!data || typeof data !== 'object') return false;
	const msg = data as Partial<AuthMessage>;
	
	if (typeof msg.type !== 'string') return false;
	
	switch (msg.type) {
		case 'login':
			return isValidToken((msg as any).token);
		case 'logout':
		case 'request_session':
			return true;
		case 'session_response':
			const token = (msg as any).token;
			return token === null || isValidToken(token);
		default:
			return false;
	}
}

function getStoredToken(): AuthToken | null {
	if (!browser) return null;
	const raw = sessionStorage.getItem(TOKEN_KEY);
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
		sessionStorage.setItem(TOKEN_KEY, JSON.stringify(token));
		authChannel?.postMessage({ type: 'login', token } as AuthMessage);
	} else {
		sessionStorage.removeItem(TOKEN_KEY);
		authChannel?.postMessage({ type: 'logout' } as AuthMessage);
	}
}

if (authChannel) {
	authChannel.onmessage = (event: MessageEvent) => {
		if (!isValidAuthMessage(event.data)) {
			console.warn('[Auth] Received invalid auth message, ignoring');
			return;
		}
		
		const message = event.data;
		
		if (message.type === 'login') {
			sessionStorage.setItem(TOKEN_KEY, JSON.stringify(message.token));
			window.dispatchEvent(new CustomEvent('auth-changed'));
		} else if (message.type === 'logout') {
			sessionStorage.removeItem(TOKEN_KEY);
			window.dispatchEvent(new CustomEvent('auth-changed'));
		} else if (message.type === 'request_session') {
			const token = getStoredToken();
			if (token && Date.now() < token.expires) {
				authChannel?.postMessage({ type: 'session_response', token } as AuthMessage);
			}
		} else if (message.type === 'session_response' && message.token) {
			if (!getStoredToken()) {
				sessionStorage.setItem(TOKEN_KEY, JSON.stringify(message.token));
				window.dispatchEvent(new CustomEvent('auth-changed'));
			}
		}
	};
}

if (browser && authChannel && !getStoredToken()) {
	authChannel.postMessage({ type: 'request_session' } as AuthMessage);
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

	const wwwAuth = initial.headers.get('WWW-Authenticate') ?? initial.headers.get('Www-Authenticate');
	if (!wwwAuth?.startsWith('Digest ')) {
		const headerNames = [...initial.headers.keys()];
		throw new Error(
			wwwAuth 
				? `Unsupported auth type: ${wwwAuth.split(' ')[0]}`
				: `Server does not support digest auth (accessible headers: ${headerNames.join(', ') || 'none'})`
		);
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
