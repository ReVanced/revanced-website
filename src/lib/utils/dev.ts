import { dev } from '$app/environment';

export function dev_log(part: string, ...args: unknown[]): void {
	if (dev) {
		console.log(`[${part}]:`, ...args);
	}
}

export function dev_warn(part: string, ...args: unknown[]): void {
	if (dev) {
		console.warn(`[${part}]:`, ...args);
	}
}

export function dev_error(part: string, ...args: unknown[]): void {
	if (dev) {
		console.error(`[${part}]:`, ...args);
	}
}
