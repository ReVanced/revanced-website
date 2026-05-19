import type { Handle } from '@sveltejs/kit';
import { createStorageFromPlatform, runWithStorage } from '$lib/api/storage';

export const handle: Handle = async ({ event, resolve }) => {
	const storage = createStorageFromPlatform(event.platform);
	return runWithStorage(storage, () => resolve(event));
};
