type DurableObjectState = {
	storage: {
		get<T = unknown>(key: string): Promise<T | undefined>;
		put(key: string, value: unknown): Promise<void>;
		delete(key: string): Promise<boolean>;
	};
};

export class FallbackStorage {
	constructor(private readonly state: DurableObjectState) {}

	async fetch(request: Request): Promise<Response> {
		const key = decodeURIComponent(new URL(request.url).pathname.slice(1));

		if (request.method === 'GET') {
			const value = await this.state.storage.get<string>(key);
			return value === undefined
				? new Response(null, { status: 404 })
				: new Response(value, { status: 200 });
		}

		if (request.method === 'PUT') {
			await this.state.storage.put(key, await request.text());
			return new Response(null, { status: 204 });
		}

		if (request.method === 'DELETE') {
			await this.state.storage.delete(key);
			return new Response(null, { status: 204 });
		}

		return new Response('Method not allowed', { status: 405 });
	}
}

export default {
	fetch(): Response {
		return new Response('Not Found', { status: 404 });
	}
};
