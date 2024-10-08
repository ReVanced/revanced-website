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
	Announcement
} from '$lib/types';
import { get_access_token, is_logged_in, UnauthenticatedError } from '$lib/auth';

export type ContributorsData = { contributables: Contributable[] };
export type PatchesData = { patches: Patch[]; packages: string[] };
export type ReleaseData = { release: Release };
export type TeamData = { members: TeamMember[] };
export type AboutData = { about: About };
export type DonationData = { wallets: CryptoWallet[]; platforms: DonationPlatform[] };
export type SocialsData = { socials: Social[] };
export type AnnouncementsData = { announcements: Announcement[] };

type ApiAnnouncementCreate = {
	archivedAt?: string;
	attachmentUrls?: string[];
	author?: string;
	channel?: string;
	content?: string;
	level?: number;
	title: string;
};

export function build_url(endpoint: string) {
	return `${settings.api_base_url()}/${endpoint}`;
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
	}).then((r) => r.json());
}

async function patch_json(endpoint: string, body?: any) {
	if (!is_logged_in()) throw new UnauthenticatedError();
	const headers = build_headers();
	return await fetch(build_url(endpoint), {
		method: 'PATCH',
		headers,
		body: body ? JSON.stringify(body) : ''
	}).then((r) => r.json());
}

async function delete_json(endpoint: string, body?: any) {
	if (!is_logged_in()) throw new UnauthenticatedError();
	const headers = build_headers();
	return await fetch(build_url(endpoint), {
		method: 'DELETE',
		headers,
		body: body ? JSON.stringify(body) : ''
	}).then((r) => r.json());
}

async function contributors(): Promise<ContributorsData> {
	const json = await get_json('v3/contributors');
	return { contributables: json };
}

async function manager(): Promise<ReleaseData> {
	const json = await get_json('v3/manager/latest');
	return { release: json };
}

async function patches(): Promise<PatchesData> {
	const json = await get_json('v3/patches/latest/list');
	const packagesWithCount: { [key: string]: number } = {};

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
	const json = await get_json('v3/team');
	return { members: json };
}

async function about(): Promise<AboutData> {
	const json = await get_json('v3/about');
	return { about: json };
}

async function announcements(channel?: string): Promise<AnnouncementsData> {
	// const json = await get_json(channel ? `v3/announcements/${channel}` : 'v3/announcements');
	// return { announcements: json.reverse() };
	return {
		announcements: [
			{
				author: 'madkarmaa',
				channel: 'test',
				content: 'short content',
				createdAt: {
					value: '2024-09-03T15:53:01.532Z'
				},
				id: 69,
				level: 69,
				title: 'test title',
				attachmentUrls: [
					'https://repository-images.githubusercontent.com/731390704/b0ddaf49-d868-4bb5-866c-417a86ebbf65',
					'https://repository-images.githubusercontent.com/731390704/b0ddaf49-d868-4bb5-866c-417a86ebbf65',
					'https://repository-images.githubusercontent.com/731390704/b0ddaf49-d868-4bb5-866c-417a86ebbf65'
				]
			},
			{
				author: 'balls',
				channel: 'test2',
				content:
					'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis.',
				createdAt: {
					value: '2024-09-11T07:32:38.849Z'
				},
				attachmentUrls: [
					'https://repository-images.githubusercontent.com/731390704/b0ddaf49-d868-4bb5-866c-417a86ebbf65',
					'https://repository-images.githubusercontent.com/731390704/b0ddaf49-d868-4bb5-866c-417a86ebbf65',
					'https://repository-images.githubusercontent.com/731390704/b0ddaf49-d868-4bb5-866c-417a86ebbf65'
				],
				id: 874,
				level: 874,
				title: 'test title 2'
			},
			{
				author: 'balls',
				channel: 'test2',
				content:
					'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis.',
				createdAt: {
					value: '2024-09-03T15:54:31.912Z'
				},
				id: 510,
				level: 510,
				title: 'test title 2'
			},
			{
				author: 'balls',
				channel: 'test2',
				content:
					'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis.',
				createdAt: {
					value: '2024-09-03T15:54:31.912Z'
				},
				attachmentUrls: [
					'https://repository-images.githubusercontent.com/731390704/b0ddaf49-d868-4bb5-866c-417a86ebbf65',
					'https://repository-images.githubusercontent.com/731390704/b0ddaf49-d868-4bb5-866c-417a86ebbf65',
					'https://repository-images.githubusercontent.com/731390704/b0ddaf49-d868-4bb5-866c-417a86ebbf65'
				],
				id: 87,
				level: 87,
				title: 'test title 2'
			},
			{
				author: 'balls',
				channel: 'test2',
				content:
					'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit dignissimos reiciendis quo alias, nihil error eaque consectetur nam quaerat accusamus iste fugit, ad, atque placeat perferendis commodi culpa sequi nobis.',
				createdAt: {
					value: '2024-09-03T15:54:31.912Z'
				},
				id: 8,
				level: 8,
				title: 'test title 2'
			},
			{
				author: 'madkarmaa',
				channel: 'test',
				content: 'short content',
				createdAt: {
					value: '2024-09-03T15:53:01.532Z'
				},
				id: 984,
				level: 984,
				title: 'test title',
				attachmentUrls: [
					'https://repository-images.githubusercontent.com/731390704/b0ddaf49-d868-4bb5-866c-417a86ebbf65',
					'https://repository-images.githubusercontent.com/731390704/b0ddaf49-d868-4bb5-866c-417a86ebbf65',
					'https://repository-images.githubusercontent.com/731390704/b0ddaf49-d868-4bb5-866c-417a86ebbf65'
				]
			}
		]
	};
}

async function create_announcement(announcement: ApiAnnouncementCreate) {
	await post_json('v3/announcements', announcement);
}

async function update_announcement(announcement: ApiAnnouncementCreate) {
	await patch_json('v3/announcements', announcement);
}

async function delete_announcement(id: number) {
	await delete_json(`v3/announcements/${id}`);
}

async function archive_announcement(id: number) {
	await post_json(`v3/announcements/${id}/archive`);
}

async function unarchive_announcement(id: number) {
	await post_json(`v3/announcements/${id}/unarchive`);
}

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
	announcements: (channel?: string) => ({
		queryKey: ['announcements'],
		queryFn: () => announcements(channel),
		staleTime
	})
};
