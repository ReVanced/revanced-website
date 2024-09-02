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
	CompatiblePackage
} from '$lib/types';

export type ContributorsData = { contributables: Contributable[] };
export type PatchesData = { patches: Patch[]; packages: string[] };
export type ReleaseData = { release: Release };
export type TeamData = { members: TeamMember[] };
export type AboutData = { about: About };
export type DonationData = { wallets: CryptoWallet[]; platforms: DonationPlatform[] };
export type SocialsData = { socials: Social[] };

async function get_json(endpoint: string) {
	const url = `${settings.api_base_url()}/${endpoint}`;
	return await fetch(url).then((r) => r.json());
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

export const staleTime = 5 * 60 * 1000;
export const queries = {
	manager: {
		queryKey: ['manager'],
		queryFn: manager,
		staleTime
	},
	patches: {
		queryKey: ['patches'],
		queryFn: patches,
		staleTime
	},
	contributors: {
		queryKey: ['contributors'],
		queryFn: contributors,
		staleTime
	},
	team: {
		queryKey: ['team'],
		queryFn: team,
		staleTime
	},
	about: {
		queryKey: ['info'],
		queryFn: about,
		staleTime
	}
};
