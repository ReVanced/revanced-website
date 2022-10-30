import type { Readable, Subscriber, Unsubscriber, Writable } from "svelte/store";
import { writable } from "svelte/store";
import { error } from "@sveltejs/kit";

import { prerendering, browser } from "$app/environment";

import * as settings from "./settings";
import * as cache from "./cache";


export class API<T> implements Readable<T> {
  private store: Writable<T>;
  // Note: transform function will not be called on cache hit.
  private transform: (v: any) => T;
  // True if we have or are about to request data from the possibly user-specified API.
  private requested_from_api = false;

  // If `transform_fn_or_key` is unspecified, the data will be returned from the API as is.
  // If `transform_fn_or_key` is a function, the JSON data will pass through it.
  // If `transform_fn_or_key` is a string, the JSON data will be assigned to a prop on an object.
  // If `load_fn_fallback` is not specified, the load function will instead cause HTTP error 500 if the API request fails (it will always throw if prerendering).
  constructor(public readonly endpoint: string, transform_fn_or_key?: ((v: any) => T) | string, private load_fn_fallback?: T) {
    if (transform_fn_or_key === undefined) {
      this.transform = (v) => v as T;
    } else if (typeof transform_fn_or_key != "string") {
      // `transform_fn_or_key` is function.
      this.transform = transform_fn_or_key;
    } else {
      // `transform_fn_or_key` is string.
      this.transform = (v) => {
        let data = {};
        data[transform_fn_or_key] = v;
        return data as T;
      };
    }
  }

  private url(): string {
    let url = `${settings.api_base_url()}/${this.endpoint}`;

    if (prerendering) {
      url += '?cacheBypass=';
      // Just add some random stuff to the string. Doesn't really matter what we add.
      // This is here to make sure we bypass the cache while prerendering.
      for (let i = 0; i < 6; i++) {
        url += Math.floor(Math.random() * 10).toString();
      }
    }

    return url;
  }

  initialized() {
    return this.store !== undefined;
  }

  // Initialize if needed
  init(data: T) {
    if (this.initialized()) {
      return;
    }

    this.store = writable(data);
  }

  // Request data, transform, cache and initialize if necessary.
  async request(fetch_fn = fetch): Promise<T> {
    if (browser) {
      this.requested_from_api = true;
    }

    // Try to get data from the cache.
    let data = cache.get(this.endpoint);

    if (data === null) {
      // Fetch and transform data
      const response = await fetch_fn(this.url());
      data = this.transform(await response.json());

      // Update the cache.
      cache.update(this.endpoint, data);
    }

    // Initialize with the data. Applicable when page load function runs on client.
    this.init(data);

    // store_in_cache(data)...

    return data;
  }

  // Implements the load function found in `+page/layout.ts` files.
  page_load_impl() {
    return async ({ fetch }) => {
      try {
        return await this.request(fetch);
      } catch(e) {
        console.error(e);
        if (this.load_fn_fallback !== undefined && !prerendering) {
          return this.load_fn_fallback;
        }
        throw error(500, "API Request Error");
      }
    };
  }

  // Implement Svelte store.
  subscribe(run: Subscriber<T>, invalidate?: any): Unsubscriber {
    if (!this.initialized()) {
      // Make sure you call <api>.init() with data from the load() function of the page you are working on or a layout above it.
      throw Error(`API "${this.endpoint}" has not been initialized yet.`);
    }
    // Make sure we have up-to-date data from the API.
    if (!this.requested_from_api && browser) {
      this.request().then(this.store.set);
    }

    return this.store.subscribe(run, invalidate);
  }
}

// API Endpoints
import type { Patch, Repository } from '../types';
import { dev_log } from "$lib/utils";

export type ContribData = { repositories: Repository[] };
export type PatchesData = { patches: Patch[]; packages: string[] };

export const contributors = new API<ContribData>("contributors", undefined, { repositories: [] });

export const patches = new API<PatchesData>("patches", patches => {
	let packages: string[] = [];

	// gets packages
	for (let i = 0; i < patches.length; i++) {
		patches[i].compatiblePackages.forEach((pkg: Patch) => {
			let index = packages.findIndex((x) => x == pkg.name);
			if (index === -1) {
				packages.push(pkg.name);
			}
		});
	}
	return { patches, packages };
});
