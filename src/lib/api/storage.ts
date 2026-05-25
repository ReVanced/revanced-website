export interface Storage {
	get(key: string): Promise<string | null>;
	set(key: string, value: string): Promise<void>;
	delete(key: string): Promise<void>;
}

type DurableObjectStub = {
	fetch(input: string, init?: RequestInit): Promise<Response>;
};

type DurableObjectNamespace = {
	idFromName(name: string): unknown;
	get(id: unknown): DurableObjectStub;
};

const STUB_NAME = 'fallback';
const STUB_BASE_URL = 'https://do/';

class CloudflareStorage implements Storage {
	private readonly stub: DurableObjectStub;

	constructor(namespace: DurableObjectNamespace) {
		this.stub = namespace.get(namespace.idFromName(STUB_NAME));
	}

	async get(key: string): Promise<string | null> {
		const response = await this.stub.fetch(STUB_BASE_URL + encodeURIComponent(key));
		if (response.status === 404 || !response.ok) return null;
		return response.text();
	}

	async set(key: string, value: string): Promise<void> {
		await this.stub.fetch(STUB_BASE_URL + encodeURIComponent(key), {
			method: 'PUT',
			body: value
		});
	}

	async delete(key: string): Promise<void> {
		await this.stub.fetch(STUB_BASE_URL + encodeURIComponent(key), {
			method: 'DELETE'
		});
	}
}

export function createStorageFromPlatform(platform: App.Platform | undefined): Storage | null {
	const ns = platform?.env?.FALLBACK_STORAGE;
	if (!ns) return null;
	return new CloudflareStorage(ns);
}
