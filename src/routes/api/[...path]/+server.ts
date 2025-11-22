import { RV_API_URL } from '../../../data/api/public';
import type { RequestHandler } from './$types';

const proxy: RequestHandler = async ({ request, params, url, fetch }) => {
	const path = params.path;
	const targetUrl = `${RV_API_URL}/${path}${url.search}`;

	const headers = new Headers(request.headers);
	headers.delete('host');
	headers.delete('connection');
	// Remove origin/referer to avoid CORS checks on the target API side if they block specific origins
	headers.delete('origin'); 
	headers.delete('referer');

	const body = request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body;

	const response = await fetch(targetUrl, {
		method: request.method,
		headers,
		body,
		// @ts-ignore
		duplex: body ? 'half' : undefined
	});

	return response;
};

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const PUT = proxy;
