import { dev } from '$app/environment';

// console.log, but only if in dev environment.
export function dev_log(part: string, ...args: any[]) {
	if (dev) {
		console.log(`[${part}]:`, ...args);
	}
}
