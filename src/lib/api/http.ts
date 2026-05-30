const DEFAULT_MAX_AGE_SECONDS = 300;
const MAX_RETRIES = 3;

export interface HttpCache {
	fetch(url: string, fetchFn: typeof fetch): Promise<Response>;
}

class CloudflareEdgeCache implements HttpCache {
	async fetch(url: string, fetchFn: typeof fetch): Promise<Response> {
		const init = { cf: { cacheEverything: true } } as RequestInit;
		const response = await fetchFn(url, init);
		if (!response.ok || response.headers.get('Cache-Control')) return response;
		const headers = new Headers(response.headers);
		headers.set('Cache-Control', `public, max-age=${DEFAULT_MAX_AGE_SECONDS}`);
		return new Response(await response.clone().arrayBuffer(), {
			status: response.status,
			statusText: response.statusText,
			headers
		});
	}
}

export function createHttpCache(): HttpCache {
	return new CloudflareEdgeCache();
}

export async function withRetries<T>(
	fn: () => Promise<T>,
	maxRetries: number = MAX_RETRIES
): Promise<T> {
	let lastError: unknown;
	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			return await fn();
		} catch (err) {
			lastError = err;
		}
	}
	throw lastError;
}
