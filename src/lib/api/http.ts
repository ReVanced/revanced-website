const DEFAULT_MAX_AGE_SECONDS = 300;
const MAX_RETRIES = 3;

export interface HttpCache {
	fetch(url: string, fetchFn: typeof fetch): Promise<Response>;
}

class CloudflareEdgeCache implements HttpCache {
	constructor(private readonly cache: Cache) {}

	async fetch(url: string, fetchFn: typeof fetch): Promise<Response> {
		const cached = await this.cache.match(url);
		if (cached) return cached;

		const fresh = await fetchFn(url);
		if (!fresh.ok) return fresh;

		const cacheControl = fresh.headers.get('Cache-Control')?.toLowerCase() ?? '';
		if (/\bno-store\b|\bno-cache\b|\bprivate\b/.test(cacheControl)) return fresh;

		if (/\bmax-age\b/.test(cacheControl)) {
			await this.cache.put(url, fresh.clone());
		} else {
			const body = await fresh.clone().arrayBuffer();
			const headers = new Headers(fresh.headers);
			headers.set('Cache-Control', `public, max-age=${DEFAULT_MAX_AGE_SECONDS}`);
			await this.cache.put(
				url,
				new Response(body, { status: fresh.status, statusText: fresh.statusText, headers })
			);
		}
		return fresh;
	}
}

class PassthroughCache implements HttpCache {
	fetch(url: string, fetchFn: typeof fetch): Promise<Response> {
		return fetchFn(url);
	}
}

export function createHttpCache(): HttpCache {
	const cache = (globalThis as { caches?: { default?: Cache } }).caches?.default;
	return cache ? new CloudflareEdgeCache(cache) : new PassthroughCache();
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
