import * as settings from './settings';

// API Endpoints
import type { Patch, Repository, Metadata, Asset } from '$lib/types';

export type ReposData = Repository[];
export type PatchesData = { patches: Patch[]; packages: string[] };
export type ReleaseData = { metadata: Metadata; assets: Asset[] };

async function get_json(endpoint: string) {
	const url = `${settings.api_base_url()}/${endpoint}`;
	return await fetch(url).then((r) => r.json());
}

async function repositories(): Promise<ReposData> {
	return await get_json('contributors').then((json) => json.repositories);
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
		json.patches[i].compatiblePackages.forEach((pkg: Patch) => {
			packagesWithCount[pkg.name] = (packagesWithCount[pkg.name] || 0) + 1;
		});
	}

	// sort packages by patch count to get most relevant apps on top
	const packages = Object.entries(packagesWithCount)
		.sort((a, b) => b[1] - a[1])
		.map((pkg) => pkg[0]);

	return { patches: json.patches, packages };
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
	}
};
