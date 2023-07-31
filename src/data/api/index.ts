import * as settings from './settings';

// API Endpoints
import type { Patch, Repository, Tool } from '$lib/types';

export type ReposData = Repository[];
export type PatchesData = { patches: Patch[]; packages: string[] };
export type ToolsData = { [repo: string]: Tool };

async function get_json(endpoint: string) {
	const url = `${settings.api_base_url()}/${endpoint}`;
	return await fetch(url).then((r) => r.json());
}

async function repositories(): Promise<ReposData> {
	return await get_json('contributors').then((json) => json.repositories);
}

async function tools(): Promise<ToolsData> {
	const json = await get_json('tools');
	// Make the data easier to work with.
	const map: Map<string, Tool> = new Map();
	for (const tool of json['tools']) {
		const repo: string = tool.repository;

		if (!map.has(repo)) {
			map.set(repo, {
				version: tool.version,
				repository: repo,
				// Just use the timestamp of the first one we find.
				timestamp: tool.timestamp,
				assets: []
			});
		}

		const value = map.get(repo)!!;
		value.assets.push({
			name: tool.name,
			size: tool.size,
			url: tool.browser_download_url,
			content_type: tool.content_type
		});

		map.set(repo, value);
	}

	return Object.fromEntries(map);
}

async function manager(): Promise<Tool> {
	return await tools().then((data) => data['revanced/revanced-manager']);
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
