import { buildUrl } from './settings';
import { getToken, isLoggedIn } from './auth';
import type {
	About,
	TeamMember,
	ManagerRelease,
	Contributable,
	Patch,
	Announcement,
	AnnouncementTag
} from './types';

async function fetchJson<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
	const response = await fetch(buildUrl(endpoint), signal ? { signal } : undefined);
	if (!response.ok) {
		throw new Error(`API error: ${response.status} ${response.statusText}`);
	}
	return response.json();
}

function buildAuthHeaders(): Record<string, string> {
	const token = getToken();
	return {
		'Content-Type': 'application/json',
		...(token ? { Authorization: `Bearer ${token}` } : {})
	};
}

async function postJson<T>(endpoint: string, body?: unknown): Promise<T | null> {
	if (!isLoggedIn()) throw new Error('Unauthenticated');
	const response = await fetch(buildUrl(endpoint), {
		method: 'POST',
		headers: buildAuthHeaders(),
		body: body ? JSON.stringify(body) : ''
	});
	if (!response.ok) {
		throw new Error(`API error: ${response.status} ${response.statusText}`);
	}
	return response.headers.get('content-length') === '0' ? null : response.json();
}

async function patchJson<T>(endpoint: string, body?: unknown): Promise<T | null> {
	if (!isLoggedIn()) throw new Error('Unauthenticated');
	const response = await fetch(buildUrl(endpoint), {
		method: 'PATCH',
		headers: buildAuthHeaders(),
		body: body ? JSON.stringify(body) : ''
	});
	if (!response.ok) {
		throw new Error(`API error: ${response.status} ${response.statusText}`);
	}
	return response.headers.get('content-length') === '0' ? null : response.json();
}

async function deleteJson<T>(endpoint: string): Promise<T | null> {
	if (!isLoggedIn()) throw new Error('Unauthenticated');
	const response = await fetch(buildUrl(endpoint), {
		method: 'DELETE',
		headers: buildAuthHeaders()
	});
	if (!response.ok) {
		throw new Error(`API error: ${response.status} ${response.statusText}`);
	}
	return response.headers.get('content-length') === '0' ? null : response.json();
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

export async function fetchAnnouncementTags(): Promise<AnnouncementTag[]> {
	return fetchJson<AnnouncementTag[]>('announcements/tags');
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

export type AnnouncementPayload = {
	title: string;
	content?: string;
	author?: string;
	tags?: string[];
	attachments?: string[];
	created_at?: string;
	archived_at?: string | null;
	level?: number;
};

export async function createAnnouncement(announcement: AnnouncementPayload): Promise<Announcement> {
	const result = await postJson<Announcement>('announcements', announcement);
	if (!result) throw new Error('Failed to create announcement');
	return result;
}

export async function updateAnnouncement(id: number, announcement: AnnouncementPayload): Promise<Announcement> {
	const result = await patchJson<Announcement>(`announcements/${id}`, announcement);
	if (!result) throw new Error('Failed to update announcement');
	return result;
}

export async function deleteAnnouncement(id: number): Promise<void> {
	await deleteJson(`announcements/${id}`);
}