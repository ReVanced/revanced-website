import { buildUrl } from './settings';
import { getToken, isLoggedIn, logout } from './auth';
import type {
	About,
	TeamMember,
	ManagerRelease,
	Contributable,
	Patch,
	Announcement
} from './types';

export class UnauthenticatedError extends Error {
	constructor() {
		super('Not authenticated');
		this.name = 'UnauthenticatedError';
	}
}

export class SessionExpiredError extends Error {
	constructor() {
		super('Session expired');
		this.name = 'SessionExpiredError';
	}
}

function buildAuthHeaders(): HeadersInit {
	const token = getToken();
	if (!token) throw new UnauthenticatedError();
	return {
		Authorization: `Bearer ${token}`,
		'Content-Type': 'application/json'
	};
}

function handleAuthError(response: Response): void {
	if (response.status === 401) {
		logout();
		throw new SessionExpiredError();
	}
}

async function fetchJson<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
	const response = await fetch(buildUrl(endpoint), signal ? { signal } : undefined);
	if (!response.ok) {
		throw new Error(`API error: ${response.status} ${response.statusText}`);
	}
	return response.json();
}

async function postJson<T>(endpoint: string, body?: unknown): Promise<T> {
	if (!isLoggedIn()) throw new UnauthenticatedError();
	const response = await fetch(buildUrl(endpoint), {
		method: 'POST',
		headers: buildAuthHeaders(),
		body: body ? JSON.stringify(body) : undefined
	});
	if (!response.ok) {
		handleAuthError(response);
		throw new Error(`API error: ${response.status} ${response.statusText}`);
	}
	const text = await response.text();
	return text ? JSON.parse(text) : ({} as T);
}

async function patchJson<T>(endpoint: string, body: unknown): Promise<T> {
	if (!isLoggedIn()) throw new UnauthenticatedError();
	const response = await fetch(buildUrl(endpoint), {
		method: 'PATCH',
		headers: buildAuthHeaders(),
		body: JSON.stringify(body)
	});
	if (!response.ok) {
		handleAuthError(response);
		throw new Error(`API error: ${response.status} ${response.statusText}`);
	}
	const text = await response.text();
	return text ? JSON.parse(text) : ({} as T);
}

async function deleteJson<T>(endpoint: string): Promise<T> {
	if (!isLoggedIn()) throw new UnauthenticatedError();
	const response = await fetch(buildUrl(endpoint), {
		method: 'DELETE',
		headers: buildAuthHeaders()
	});
	if (!response.ok) {
		handleAuthError(response);
		throw new Error(`API error: ${response.status} ${response.statusText}`);
	}
	const text = await response.text();
	return text ? JSON.parse(text) : ({} as T);
}

export async function fetchAbout(): Promise<About> {
	return fetchJson<About>('about');
}

export async function fetchTeam(): Promise<TeamMember[]> {
	return fetchJson<TeamMember[]>('team');
}

export async function fetchManager(): Promise<ManagerRelease> {
	return fetchJson<ManagerRelease>('manager');
}

export async function fetchContributors(): Promise<Contributable[]> {
	return fetchJson<Contributable[]>('contributors');
}

export async function fetchPatches(): Promise<Patch[]> {
	return fetchJson<Patch[]>('patches/list');
}

export type FetchAnnouncementsOptions = {
	tags?: string[];
	count?: number;
	cursor?: number;
};

export async function fetchAnnouncements(options: FetchAnnouncementsOptions = {}): Promise<Announcement[]> {
	const baseUrl = buildUrl('announcements');
	const url = new URL(baseUrl, window.location.origin);

	if (options.tags && options.tags.length > 0) {
		url.searchParams.set('tags', options.tags.join(','));
	}
	if (options.count !== undefined) {
		url.searchParams.set('count', String(options.count));
	}
	if (options.cursor !== undefined) {
		url.searchParams.set('cursor', String(options.cursor));
	}

	const response = await fetch(url.toString());
	if (!response.ok) {
		throw new Error(`API error: ${response.status} ${response.statusText}`);
	}
	return response.json();
}

export async function fetchAnnouncementById(id: number, signal?: AbortSignal): Promise<Announcement> {
	return fetchJson<Announcement>(`announcements/${id}`, signal);
}

export async function checkApiHealth(): Promise<boolean> {
	try {
		const response = await fetch(buildUrl('ping'), {
			method: 'HEAD',
			signal: AbortSignal.timeout(5000)
		});
		return response.ok;
	} catch {
		console.log('API health check failed');
		return false;
	}
}

export type AnnouncementInput = {
	title: string;
	content?: string | null;
	attachments?: string[];
	tags?: string[];
	level?: number;
	author?: string;
};

export async function createAnnouncement(announcement: AnnouncementInput): Promise<void> {
	await postJson('announcements', announcement);
}

export async function updateAnnouncement(id: number, announcement: AnnouncementInput): Promise<void> {
	await patchJson(`announcements/${id}`, announcement);
}

export async function deleteAnnouncement(id: number): Promise<void> {
	await deleteJson(`announcements/${id}`);
}

export async function archiveAnnouncement(id: number): Promise<void> {
	await postJson(`announcements/${id}/archive`);
}

export async function unarchiveAnnouncement(id: number): Promise<void> {
	await postJson(`announcements/${id}/unarchive`);
}