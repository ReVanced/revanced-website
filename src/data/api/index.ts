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

export type ContributorsData = { contributables: Contributable[] };
export type PatchesData = { patches: Patch[]; packages: string[] };
export type ReleaseData = { release: Release };
export type TeamData = { members: TeamMember[] };
export type AboutData = { about: About };
export type DonationData = { wallets: CryptoWallet[]; platforms: DonationPlatform[] };
export type SocialsData = { socials: Social[] };
export type AnnouncementsData = { announcements: Announcement[] };

function build_url(endpoint: string) {
	return `${settings.api_base_url()}/${endpoint}`;
}

async function get_json(endpoint: string) {
	return await fetch(build_url(endpoint)).then((r) => r.json());
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
				content: 'test content',
				createdAt: {
					value: '2024-09-03T15:53:01.532Z'
				},
				id: 69,
				level: 69,
				title: 'test title'
			},
			{
				author: 'balls',
				channel: 'test2',
				content: 'test content 2',
				createdAt: {
					value: '2024-09-03T15:54:31.912Z'
				},
				id: 420,
				level: 420,
				title: 'test title 2'
			}
		]
	};
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
