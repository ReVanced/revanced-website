export interface Storage {
	get(key: string): Promise<string | null>;
	set(key: string, value: string | null): Promise<void>;
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

	async set(key: string, value: string | null): Promise<void> {
		if (value === null) {
			await this.kv.delete(key);
		} else {
			await this.kv.put(key, value);
		}
	}
}

export function createStorageFromPlatform(platform: App.Platform | undefined): Storage | null {
	const kv = platform?.env?.STORAGE;
	if (!kv) return null;
	return new CloudflareStorage(kv);
}

export type StoredFallback = { url: string | null; recover: boolean };

export function parseStoredFallback(raw: string | null): StoredFallback | null {
	if (!raw) return null;
	try {
		return JSON.parse(raw) as StoredFallback;
	} catch {
		return null;
	}
}

export function resolveActiveUrls(
	stored: StoredFallback | null,
	primary: string,
	envFallback: string | null
): { primary: string; fallback: string | null } {
	if (stored && stored.recover === false && stored.url) {
		return { primary: stored.url, fallback: null };
	}
	return { primary, fallback: stored?.url || envFallback };
}
