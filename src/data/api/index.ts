import type { Readable, Subscriber, Unsubscriber, Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import { error } from '@sveltejs/kit';

import { building, browser, dev } from '$app/environment';

import * as settings from './settings';
import * as cache from './cache';

export class API<T> implements Readable<T> {
	private store: Writable<T>;
	// True if we have or are about to request data from the API.
	has_requested: boolean;

	// `transform` will transform the data received from the API.
	constructor(
		public readonly endpoint: string,
		private readonly default_value: T,
		private readonly transform: (v: any) => T = (v) => v as T
	) {
		// Initialize with cached data if possible.
		const cached_data = cache.get(this.endpoint);
		this.has_requested = cached_data !== null;

		this.store = writable(cached_data || this.default_value);
	}

	private url() {
		return `${settings.api_base_url()}/${this.endpoint}`;
	}

	// Please don't call this directly
	private async _update(fetch_fn: typeof fetch) {
		// Try to get data from the cache.
		let data = cache.get(this.endpoint);

		if (data === null) {
			// Fetch and transform data
			const response = await fetch_fn(this.url());
			data = this.transform(await response.json());

			// Update the cache.
			cache.update(this.endpoint, data);
		}

		this.store.set(data);
	}

	// Retrieve data and update.
	private update(fetch_fn = fetch) {
		// Make sure we set this immediately outside of the async function to avoid JS event loop weirdness.
		this.has_requested = true;
		return this._update(fetch_fn);
	}

	// Start retrieving data if needed.
	retrieve_if_needed() {
		if (!this.has_requested) {
			return this.update();
		}
		return Promise.resolve();
	}

	// Implements the load function found in `+page/layout.ts` files.
	page_load_impl() {
		return async ({ fetch }) => {
			if (building) {
				return {};
			}

			// Might be better to actually return some data from the load function and use that on the client.
			if (!(dev || browser || building)) {
				throw new Error(
					'The API client is not optimized for production server-side rendering. Please change that :)'
				);
			}

			try {
				await this.update(fetch);
				return {};
			} catch (e) {
				console.error(e);
				throw error(504, 'API Request Error');
			}
		};
	}

	// Implement Svelte store.
	subscribe(run: Subscriber<T>, invalidate?: any): Unsubscriber {
		// Make sure we have up-to-date data from the API.
		if (browser) {
			this.retrieve_if_needed();
		}

		return this.store.subscribe(run, invalidate);
	}
}

// API Endpoints
import type { Patch, Repository, Tool } from '$lib/types';
import { dev_log } from '$lib/utils';

export type ReposData = Repository[];
export type PatchesData = { patches: Patch[]; packages: string[] };
export type ToolsData = { [repo: string]: Tool };
export type SocialsData = { [repo: string]: Tool };

export const repositories = new API<ReposData>('contributors', [], (json) => json.repositories);

// It needs to look this way to not break everything.
const tools_placeholder: ToolsData = {
	'revanced/revanced-manager': {
		version: 'v0.0.0',
		timestamp: '',
		repository: '',
		assets: [
			{
				url: '',
				name: '',
				content_type: '',
				size: null
			}
		]
	}
};

export const tools = new API<ToolsData>('tools', tools_placeholder, (json) => {
	// The API returns data in a weird shape. Make it easier to work with.
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
});

export const patches = new API<PatchesData>('patches', { patches: [], packages: [] }, (patches) => {
	const packagesWithCount: { [key: string]: number } = {};

	// gets packages and patch count
	for (let i = 0; i < patches.length; i++) {
		patches[i].compatiblePackages.forEach((pkg: Patch) => {
			packagesWithCount[pkg.name] = (packagesWithCount[pkg.name] || 0) + 1;
		});
	}

	// sort packages by patch count to get most relevant apps on top
	const packages = Object.entries(packagesWithCount)
		.sort((a, b) => b[1] - a[1])
		.map((pkg) => pkg[0]);

	return { patches, packages };
});
