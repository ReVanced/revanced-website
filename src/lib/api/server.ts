import { RV_API_URL } from '$env/static/public';
import type {
	About,
	TeamMember,
	ManagerRelease,
	Contributable,
	Announcement,
	TaggedLatestAnnouncements
} from './types';
import {
	AboutSchema,
	TeamMembersSchema,
	ManagerReleaseSchema,
	ContributablesSchema,
	AnnouncementsSchema,
	LatestAnnouncementsSchema
} from './schemas';
import type { z } from 'zod';
import { parseFragment, serialize } from 'parse5';

const API_VERSION = 'v5';

/*

Announcement bodies are raw HTML entered by admins and some of the olderones aint quite valid (<ul> / <a> left open, stray </li>, etc....).
If we pass that straight to {@html} during SSR the browser fixes it up while parsing. That can move svelte's {@html} end marker so hydration loses its place and the whole app gets rerendered on the client.

We run the same HTML5 parsing the browser uses and send the already-fixed markup instead. 

That way the browser don't have to change anything and SSR + hydration stay in sync. 

This is just normalisation, not sanitising, we are NOT removing content, tags or links.

Server-only: this is only imported from +page.server.ts / +layout.server.ts so parse5 never ends up in the browser bundle. */

export function normalizeHtml(html: string | null | undefined): string | null {
	if (!html) return html ?? null;
	try {
		return serialize(parseFragment(html));
	} catch {
		return html;
	}
}

function buildServerUrl(endpoint: string): string {
	endpoint = endpoint.replace(/^\/+/, '');
	return `${RV_API_URL}/${API_VERSION}/${endpoint}`;
}

async function fetchJsonServer<T>(
	endpoint: string,
	schema: z.ZodType<T>,
	fetchFn: typeof fetch = fetch
): Promise<T> {
	const url = buildServerUrl(endpoint);
	const response = await fetchFn(url, { cache: 'no-store' });

	if (!response.ok) {
		throw new Error(`API error: ${response.status} ${response.statusText}`);
	}

	const data = await response.json();
	const result = schema.safeParse(data);
	if (!result.success) {
		console.error(`Validation failed for ${endpoint}:`, result.error.issues);
		throw new Error(`Invalid response from ${endpoint}`);
	}
	return result.data;
}

export async function fetchAbout(fetchFn?: typeof fetch): Promise<About> {
	return fetchJsonServer('about', AboutSchema, fetchFn);
}

export async function fetchTeam(fetchFn?: typeof fetch): Promise<TeamMember[]> {
	return fetchJsonServer('team', TeamMembersSchema, fetchFn);
}

export async function fetchManager(fetchFn?: typeof fetch): Promise<ManagerRelease> {
	return fetchJsonServer('manager', ManagerReleaseSchema, fetchFn);
}

export async function fetchContributors(fetchFn?: typeof fetch): Promise<Contributable[]> {
	return fetchJsonServer('contributors', ContributablesSchema, fetchFn);
}

export async function fetchAnnouncements(fetchFn?: typeof fetch): Promise<Announcement[]> {
	const announcements = await fetchJsonServer('announcements', AnnouncementsSchema, fetchFn);
	return announcements.map((announcement) => ({
		...announcement,
		content: normalizeHtml(announcement.content)
	}));
}

export async function fetchLatestAnnouncements(
	fetchFn?: typeof fetch
): Promise<TaggedLatestAnnouncements[]> {
	const latest = await fetchJsonServer('announcements/latest', LatestAnnouncementsSchema, fetchFn);
	return latest.map((entry) => ({
		...entry,
		announcement: { ...entry.announcement, content: normalizeHtml(entry.announcement.content) }
	}));
}
