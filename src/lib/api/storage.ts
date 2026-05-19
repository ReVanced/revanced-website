import { AsyncLocalStorage } from 'node:async_hooks';

export interface Storage {
	get(key: string): Promise<string | null>;
	set(key: string, value: string): Promise<void>;
	delete(key: string): Promise<void>;
}

type CloudflareKV = {
	get(key: string): Promise<string | null>;
	put(key: string, value: string): Promise<unknown>;
	delete(key: string): Promise<unknown>;
};

class CloudflareStorage implements Storage {
	constructor(private readonly kv: CloudflareKV) {}

	get(key: string): Promise<string | null> {
		return this.kv.get(key);
	}

	async set(key: string, value: string): Promise<void> {
		await this.kv.put(key, value);
	}

	async delete(key: string): Promise<void> {
		await this.kv.delete(key);
	}
}

const storageContext = new AsyncLocalStorage<Storage | null>();

export function getCurrentStorage(): Storage | null {
	return storageContext.getStore() ?? null;
}

export function runWithStorage<T>(
	storage: Storage | null,
	fn: () => T | Promise<T>
): T | Promise<T> {
	return storageContext.run(storage, fn);
}

export function createStorageFromPlatform(platform: App.Platform | undefined): Storage | null {
	const kv = platform?.env?.FALLBACK_STORAGE;
	if (!kv) return null;
	return new CloudflareStorage(kv);
}
