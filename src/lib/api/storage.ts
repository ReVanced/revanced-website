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

export function createStorageFromPlatform(platform: App.Platform | undefined): Storage | null {
	const kv = platform?.env?.FALLBACK_STORAGE;
	if (!kv) return null;
	return new CloudflareStorage(kv);
}
