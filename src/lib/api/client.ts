import { buildUrl } from './settings';
import type {
	About,
	TeamMember,
	ManagerRelease,
	Contributable,
	Patch,
	Announcement
} from './types';

async function fetchJson<T>(endpoint: string): Promise<T> {
	const response = await fetch(buildUrl(endpoint));
	if (!response.ok) {
		throw new Error(`API error: ${response.status} ${response.statusText}`);
	}
	return response.json();
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

export async function fetchAnnouncements(): Promise<Announcement[]> {
	return fetchJson<Announcement[]>('announcements');
}


export async function fetchAnnouncementById(id: number): Promise<Announcement> {
	return fetchJson<Announcement>(`announcements/${id}`);
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
