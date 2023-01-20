import * as settings from './settings';

// API Endpoints
import type { Patch, Repository, Tool } from '../../utils/types';

export type ReposData = Repository[];
export type PatchesData = { patches: Patch[]; packages: string[] };
export type ToolsData = { [repo: string]: Tool };

async function get_json(endpoint: string) {
    const url = `${settings.api_base_url()}/${endpoint}`;
    return await fetch(url).then((r) => r.json());
}

export function repositories(): Promise<ReposData> {
    return get_json("contributors").then(json => json.repositories);
}

async function tools(): Promise<ToolsData> {
  const json = await get_json("tools");
	// Make the data easier to work with.
	let map: Map<string, Tool> = new Map();
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

		let value = map.get(repo);
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

export function manager(): Promise<Tool> {
    return tools().then(data => data['revanced/revanced-manager']);
}

export async function patches(): Promise<PatchesData> {
    const json = await get_json("patches");
	const packagesWithCount: { [key: string]: number } = {};

	// gets packages and patch count
	for (let i = 0; i < json.length; i++) {
		json[i].compatiblePackages.forEach((pkg: Patch) => {
			packagesWithCount[pkg.name] = (packagesWithCount[pkg.name] || 0) + 1;
		});
	}

	// sort packages by patch count to get most relevant apps on top
	const packages = Object.entries(packagesWithCount)
		.sort((a, b) => b[1] - a[1])
		.map((pkg) => pkg[0]);

   return { patches: json, packages };
};
