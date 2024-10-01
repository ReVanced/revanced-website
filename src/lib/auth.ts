import { browser } from '$app/environment';
import { build_url } from '$data/api';

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
	const data = localStorage.getItem('revanced_api_access_token');
	if (data) return JSON.parse(data) as AuthToken;
	return null;
}

// (Re)set access token.
export function set_access_token(token?: AuthToken) {
	if (!token) localStorage.removeItem('revanced_api_access_token');
	else localStorage.setItem('revanced_api_access_token', JSON.stringify(token));
}

// Parse a JWT token
export function parseJwt(token: string): JwtPayload {
	const base64Url = token.split('.')[1];
	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	const jsonPayload = decodeURIComponent(
		atob(base64)
			.split('')
			.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
			.join('')
	);
	return JSON.parse(jsonPayload) as JwtPayload;
}

// Check if the admin is authenticated
export function is_logged_in(): boolean {
	const token = get_access_token();
	if (!token) return false;
	return Date.now() < token.expires;
}

export async function login() {
	const res = await fetch(build_url('v3/token'));
	if (!res.ok) return false;

	const data = await res.json();
	const payload = parseJwt(data.token);
	set_access_token({ token: data.token, expires: payload.exp * 1000 });
	return true;
}
