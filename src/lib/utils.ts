import { prerendering } from "$app/environment";

export function api_url(endpoint: string): string {
  let url = `https://releases.revanced.app/${endpoint}`;

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
