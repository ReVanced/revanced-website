import { browser } from '$app/environment';
import { PersistedState } from 'runed';
import type { z } from 'zod';

export function createValidatedPersistedState<T>(
	key: string,
	defaultValue: T,
	schema: z.ZodType<T>
): PersistedState<T> {
	return new PersistedState<T>(key, defaultValue, {
		serializer: {
			serialize: JSON.stringify,
			deserialize: (str: string) => {
				try {
					const parsed = JSON.parse(str);
					const result = schema.safeParse(parsed);
					if (result.success) {
						return result.data;
					}
					console.warn(`[PersistedState] Invalid data for key "${key}", resetting to default`);
					if (browser) {
						queueMicrotask(() => {
							try {
								localStorage.setItem(key, JSON.stringify(defaultValue));
							} catch {
							}
						});
					}
					return defaultValue;
				} catch {
					console.warn(`[PersistedState] Failed to parse data for key "${key}", resetting to default`);
					if (browser) {
						queueMicrotask(() => {
							try {
								localStorage.setItem(key, JSON.stringify(defaultValue));
							} catch {
							
							}
						});
					}
					return defaultValue;
				}
			}
		}
	});
}
