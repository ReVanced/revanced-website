import { browser } from '$app/environment';
import { build_url } from '$data/api';
import { jwtDecode } from 'jwt-decode';

export type AuthToken = {
	token: string;
	expires: number;
};

type JwtPayload = {
	exp: number;
	iss: string;
	iat: number;
};

export class UnauthenticatedError extends Error {
	constructor() {
		super('Unauthenticated. Cannot perform admin operations.');
	}
}

// Get access token.
export function get_access_token(): AuthToken | null {
	if (!browser) return null;
	try {
		const data = localStorage.getItem('revanced_api_access_token');
		if (data) return JSON.parse(data) as AuthToken;
		return null;
	} catch (error) {
		console.error('Failed to get access token:', error);
		return null;
	}
}

// (Re)set access token.
export function set_access_token(token?: AuthToken) {
	try {
		if (!token) localStorage.removeItem('revanced_api_access_token');
		else localStorage.setItem('revanced_api_access_token', JSON.stringify(token));
	} catch (error) {
		console.error('Failed to set access token:', error);
	}
}

// Parse a JWT token
export function parseJwt(token: string): JwtPayload {
	return jwtDecode<JwtPayload>(token);
}

// Check if the admin is authenticated
export function is_logged_in(): boolean {
	const token = get_access_token();
	if (!token) return false;
	return Date.now() < token.expires;
}

async function digest_fetch(
	url: string,
	username: string,
	password: string,
	options: RequestInit = {}
): Promise<Response> {
	// Helper function to convert ArrayBuffer to Hex string
	function bufferToHex(buffer: ArrayBuffer): string {
		return Array.from(new Uint8Array(buffer))
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');
	}

	// Generate SHA-256 digest
	async function sha256(message: string): Promise<string> {
		const encoder = new TextEncoder();
		const data = encoder.encode(message);
		const hashBuffer = await crypto.subtle.digest('SHA-256', data);
		return bufferToHex(hashBuffer);
	}

	// Perform an initial request to get the `WWW-Authenticate` header
	const initialResponse = await fetch(url, {
		method: options.method || 'GET',
		headers: options.headers || {}
	});

	if (!initialResponse.ok && initialResponse.status !== 401)
		throw new Error(`Initial request failed with status: ${initialResponse.status}`);

	if (initialResponse.ok && initialResponse.status === 200) return initialResponse;

	const authHeader = initialResponse.headers.get('Www-Authenticate');
	if (!authHeader || !authHeader.startsWith('Digest '))
		throw new Error('No Digest authentication header found');

	// Parse the `WWW-Authenticate` header to extract the fields
	const authParams = authHeader
		.replace('Digest ', '')
		.match(/(\w+)=("[^"]*"|[^,]*)/g)
		?.reduce((acc: Record<string, string>, item) => {
			const [key, value] = item.split('=');
			acc[key] = value.replace(/"/g, '');
			return acc;
		}, {}) || {};

	const { realm, nonce, algorithm } = authParams;
	const method = options.method || 'GET';
	const uri = new URL(url).pathname;

	// https://ktor.io/docs/server-digest-auth.html#flow
	const HA1 = await sha256(`${username}:${realm}:${password}`);
	const HA2 = await sha256(`${method}:${uri}`);

	const responseHash = await sha256(`${HA1}:${nonce}:${HA2}`);

	// Build the Authorization header
	const authHeaderDigest = `Digest username="${username}", realm="${realm}", nonce="${nonce}", uri="${uri}", algorithm=${algorithm}, response="${responseHash}"`;

	// Perform the final request with the Authorization header
	const finalResponse = await fetch(url, {
		...options,
		headers: {
			...options.headers,
			Authorization: authHeaderDigest
		}
	});

	return finalResponse;
}

export async function login(username: string, password: string) {
	// Validate inputs
	if (!username || !password) {
		console.error('Username and password are required');
		return false;
	}

	if (username.length < 1 || username.length > 255) {
		console.error('Invalid username length');
		return false;
	}

	if (password.length < 1 || password.length > 255) {
		console.error('Invalid password length');
		return false;
	}

	const res = await digest_fetch(build_url('token'), username, password);
	if (!res.ok) return false;

	const data = await res.json();
	const payload = parseJwt(data.token);
	set_access_token({ token: data.token, expires: payload.exp * 1000 });
	return true;
}
