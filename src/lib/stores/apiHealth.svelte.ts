import { browser } from '$app/environment';
import { checkApiHealth } from '$api/client';

const refreshInterval = 5 * 60 * 1000; 

let isOnline = $state(true);
let lastCheckTime = $state<number | null>(null);
let intervalId: ReturnType<typeof setInterval> | null = null;

let refetchDataCallback: (() => void) | null = null;

async function pingAndRefresh(): Promise<void> {
	const healthy = await checkApiHealth();

	isOnline = healthy;
	lastCheckTime = Date.now();
	if (healthy && refetchDataCallback) {
		refetchDataCallback();
	}
}

export function startRefreshInterval(onRefetch: () => void): void {
	if (!browser || intervalId) return;

	refetchDataCallback = onRefetch;

	checkApiHealth().then((healthy) => {
		isOnline = healthy;
		lastCheckTime = Date.now();
	});

	intervalId = setInterval(pingAndRefresh, refreshInterval);
}

export function stopRefreshInterval(): void {
	if (intervalId) {
		clearInterval(intervalId);
		intervalId = null;
	}
	refetchDataCallback = null;
}

export async function manualRefresh(): Promise<void> {
	await pingAndRefresh();
}
export const apiStatus = {
	get isOnline() {
		return isOnline;
	},
	get isOffline() {
		return !isOnline;
	},
	get lastCheckTime() {
		return lastCheckTime;
	}
};
