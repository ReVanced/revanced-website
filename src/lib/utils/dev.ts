import { dev } from '$app/environment';

export function dev_log(part: string, ...args: unknown[]): void {
	if (dev) {
		console.log(`[${part}]:`, ...args);
	}
}
