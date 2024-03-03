import * as settings from './settings';

// API Endpoints
import type {
	Patch,
	Repository,
	Metadata,
	Asset,
	TeamMember,
	DonationPlatform,
	CryptoWallet,
	Social,
	Info,
	CompatiblePackage
} from '$lib/types';

export type ReposData = { repositories: Repository[] };
export type PatchesData = { patches: Patch[]; packages: string[] };
export type ReleaseData = { metadata: Metadata; assets: Asset[] };
export type TeamData = { members: TeamMember[] };
export type InfoData = { info: Info };
export type DonationData = { wallets: CryptoWallet[]; platforms: DonationPlatform[] };
export type SocialsData = { socials: Social[] };

async function get_json(endpoint: string) {
	const url = `${settings.api_base_url()}/${endpoint}`;
	return await fetch(url).then((r) => r.json());
}

async function repositories(): Promise<ReposData> {
	const json = await get_json('contributors');
	return { repositories: json.repositories };
}

async function manager(): Promise<ReleaseData> {
	const json = await get_json('v2/revanced-manager/releases/latest');
	// console.log(json.release.metadata.tag_name);
	console.log(json.release.assets[0].browser_download_url);
	return { metadata: json.release.metadata, assets: json.release.assets };
}

async function patches(): Promise<PatchesData> {
	const json = await get_json('v2/patches/latest');
	const packagesWithCount: { [key: string]: number } = {};

	// gets packages and patch count
	for (let i = 0; i < json.patches.length; i++) {
		json.patches[i].compatiblePackages?.forEach((pkg: CompatiblePackage) => {
			packagesWithCount[pkg.name] = (packagesWithCount[pkg.name] || 0) + 1;
		});
	}

	// sort packages by patch count to get most relevant apps on top
	const packages = Object.keys(packagesWithCount);
	packages.sort((a, b) => packagesWithCount[b] - packagesWithCount[a]);

	return { patches: json.patches, packages };
}

async function team(): Promise<TeamData> {
	const json = await get_json('v2/team/members');
	return { members: json.members };
}

async function info(): Promise<InfoData> {
	const json = await get_json('v2/info');
	return { info: json.info };
}

async function donate(): Promise<DonationData> {
	const json = await get_json('v2/donations');
	return { wallets: json.donations.wallets, platforms: json.donations.links };
}

async function socials(): Promise<SocialsData> {
	const json = await get_json('v2/socials');
	return { socials: json.socials };
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
	repositories: {
		queryKey: ['repositories'],
		queryFn: repositories,
		staleTime
	},
	team: {
		queryKey: ['team'],
		queryFn: team,
		staleTime
	},
	info: {
		queryKey: ['info'],
		queryFn: info,
		staleTime
	},
	donate: {
		queryKey: ['donate'],
		queryFn: donate,
		staleTime
	},
	socials: {
		queryKey: ['socials'],
		queryFn: socials,
		staleTime
	}
};
