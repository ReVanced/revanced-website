import { browser } from '$app/environment';
import { checkApiHealth } from '$api/client';

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
const MAX_BACKOFF = 15 * 60 * 1000; // 15 minutes max
const BASE_RETRY_DELAY = 30 * 1000; // 30 seconds

let _isOnline = $state(true);
let _lastCheckTime = $state<number | null>(null);
let _intervalId: ReturnType<typeof setInterval> | null = null;
let _initialized = false;
let _consecutiveFailures = 0;

async function checkStatus(): Promise<void> {
	try {
		const healthy = await checkApiHealth();
		_isOnline = healthy;
		_lastCheckTime = Date.now();
		
		if (healthy) {
			_consecutiveFailures = 0;
			if (_intervalId && _consecutiveFailures > 0) {
				clearInterval(_intervalId);
				_intervalId = setInterval(checkStatus, REFRESH_INTERVAL);
			}
		} else {
			_consecutiveFailures++;
		}
	} catch {
		_isOnline = false;
		_lastCheckTime = Date.now();
		_consecutiveFailures++;
		
		if (_consecutiveFailures >= 3 && _intervalId) {
			const backoffTime = Math.min(BASE_RETRY_DELAY * Math.pow(2, _consecutiveFailures - 3), MAX_BACKOFF);
			clearInterval(_intervalId);
			_intervalId = setInterval(checkStatus, backoffTime);
		}
	}
}

export function startApiHealthPolling(): void {
	if (!browser || _initialized) return;
	_initialized = true;
	_consecutiveFailures = 0;

	checkStatus();

	_intervalId = setInterval(checkStatus, REFRESH_INTERVAL);
}

export function stopApiHealthPolling(): void {
	if (_intervalId) {
		clearInterval(_intervalId);
		_intervalId = null;
	}
	_consecutiveFailures = 0;
}

export async function manualRefresh(): Promise<void> {
	await checkStatus();
}

export const apiStatus = {
	get isOnline() {
		return _isOnline;
	},
	get isOffline() {
		return !_isOnline;
	},
	get lastCheckTime() {
		return _lastCheckTime;
	}
};
