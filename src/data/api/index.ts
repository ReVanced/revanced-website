import * as settings from './settings';

// API Endpoints
import type {
	Patch,
	Contributable,
	Release,
	TeamMember,
	DonationPlatform,
	CryptoWallet,
	Social,
	About,
	CompatiblePackage,
	ResponseAnnouncement,
	Announcement,
	Tags
} from '$lib/types';
import { get_access_token, is_logged_in, UnauthenticatedError } from '$lib/auth';

export type ContributorsData = { contributables: Contributable[] };
export type PatchesData = { patches: Patch[]; packages: string[] };
export type ReleaseData = { release: Release };
export type TeamData = { members: TeamMember[] };
export type AboutData = { about: About };
export type DonationData = { wallets: CryptoWallet[]; platforms: DonationPlatform[] };
export type SocialsData = { socials: Social[] };
export type AnnouncementsData = { announcements: ResponseAnnouncement[] };

type GetAnnouncementsOptions = Partial<{
	tags: string[];
	count: number;
	cursor: number;
}>;

export function build_url(endpoint: string) {
	// //////v4/contributors -> v4/contributors
	endpoint = endpoint.replace(/^\/+/, '');

	// v4/contributors -> contributors
	if (endpoint.startsWith(settings.API_VERSION)) endpoint = endpoint.split('/').slice(1).join('/');

	return `${settings.api_base_url()}/${settings.API_VERSION}/${endpoint}`;
}

function build_headers() {
	const access_token_data = get_access_token();
	return {
		'Content-Type': 'application/json',
		Authorization: access_token_data ? `Bearer ${access_token_data.token}` : ''
	};
}

async function get_json(endpoint: string) {
	return await fetch(build_url(endpoint)).then((r) => r.json());
}

async function post_json(endpoint: string, body?: any) {
	if (!is_logged_in()) throw new UnauthenticatedError();
	const headers = build_headers();
	return await fetch(build_url(endpoint), {
		method: 'POST',
		headers,
		body: body ? JSON.stringify(body) : ''
	}).then((r) => {
		return r.headers.get('content-length') === '0' ? null : r.json();
	});
}

async function patch_json(endpoint: string, body?: any) {
	if (!is_logged_in()) throw new UnauthenticatedError();
	const headers = build_headers();
	return await fetch(build_url(endpoint), {
		method: 'PATCH',
		headers,
		body: body ? JSON.stringify(body) : ''
	}).then((r) => {
		return r.headers.get('content-length') === '0' ? null : r.json();
	});
}

async function delete_json(endpoint: string, body?: any) {
	if (!is_logged_in()) throw new UnauthenticatedError();
	const headers = build_headers();
	return await fetch(build_url(endpoint), {
		method: 'DELETE',
		headers,
		body: body ? JSON.stringify(body) : ''
	}).then((r) => {
		return r.headers.get('content-length') === '0' ? null : r.json();
	});
}

async function contributors(): Promise<ContributorsData> {
	const json = await get_json('v4/contributors');
	return { contributables: json };
}

async function manager(): Promise<ReleaseData> {
	const json = await get_json('v4/manager');

	return { release: json };
}

async function patches(): Promise<PatchesData> {
	const json = await get_json('v4/patches/list');
	const packagesWithCount: { [key: string]: number } = {};

	json.forEach((patch) => {
		if (!patch.compatiblePackages) return;

		patch.compatiblePackages = Object.keys(patch.compatiblePackages).map((name) => ({
			name,
			versions: patch.compatiblePackages[name]
		}));
	});

	// gets packages and patch count
	for (let i = 0; i < json.length; i++) {
		json[i].compatiblePackages?.forEach((pkg: CompatiblePackage) => {
			packagesWithCount[pkg.name] = (packagesWithCount[pkg.name] || 0) + 1;
		});
	}

	// sort packages by patch count to get most relevant apps on top
	const packages = Object.keys(packagesWithCount);
	packages.sort((a, b) => packagesWithCount[b] - packagesWithCount[a]);

	return { patches: json, packages };
}

async function team(): Promise<TeamData> {
	const json = await get_json('v4/team');
	return { members: json };
}

async function about(): Promise<AboutData> {
	const json = await get_json('v4/about');
	return { about: json };
}

async function announcements(options: GetAnnouncementsOptions = {}): Promise<AnnouncementsData> {
	const url = new URL(build_url('announcements'));

	if (options.tags && options.tags.length > 0) url.searchParams.set('tags', options.tags.join(','));
	if (options.count) url.searchParams.set('count', String(options.count));
	if (options.cursor) url.searchParams.set('cursor', String(options.cursor));

	const announcements = (await get_json('announcements')) as ResponseAnnouncement[];

	return { announcements };
}

async function get_announcement_by_id(id: number): Promise<{ announcement: ResponseAnnouncement }> {
	return { announcement: (await get_json(`announcements/${id}`)) as ResponseAnnouncement };
}

async function announcementTags(): Promise<{ tags: Tags }> {
	return { tags: (await get_json(`announcements/tags`)) as Tags };
}

function show_error_alert(res: Response) {
	alert(`A ${res.status < 500 ? 'user' : 'server'} error occurred. Please try again.`);
}

export async function create_announcement(announcement: Announcement) {
	await post_json('announcements', announcement).catch(show_error_alert);
}

export async function update_announcement(id: number, announcement: Announcement) {
	await patch_json(`announcements/${id}`, announcement).catch(show_error_alert);
}

export async function delete_announcement(id: number) {
	await delete_json(`announcements/${id}`).catch(show_error_alert);
}

export async function archive_announcement(id: number) {
	await post_json(`announcements/${id}/archive`).catch(show_error_alert);
}

export async function unarchive_announcement(id: number) {
	await post_json(`announcements/${id}/unarchive`).catch(show_error_alert);
}

export const admin = {
	create_announcement,
	update_announcement,
	delete_announcement,
	archive_announcement,
	unarchive_announcement
};

export const staleTime = 5 * 60 * 1000;
export const queries = {
	manager: () => ({
		queryKey: ['manager'],
		queryFn: manager,
		staleTime
	}),
	patches: () => ({
		queryKey: ['patches'],
		queryFn: patches,
		staleTime
	}),
	contributors: () => ({
		queryKey: ['contributors'],
		queryFn: contributors,
		staleTime
	}),
	team: () => ({
		queryKey: ['team'],
		queryFn: team,
		staleTime
	}),
	about: () => ({
		queryKey: ['info'],
		queryFn: about,
		staleTime
	}),
	announcements: () => ({
		queryKey: ['announcements'],
		queryFn: () => announcements(),
		staleTime
	}),
	announcementById: (id: number) => ({
		queryKey: ['announcementById', id],
		queryFn: () => get_announcement_by_id(id)
	}),
	announcementTags: () => ({
		queryKey: ['announcementTags'],
		queryFn: () => announcementTags(),
		staleTime
	})
};
