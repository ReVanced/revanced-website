import { browser } from "$app/environment";

import { dev_log } from "$lib/utils";

const CACHE_KEY_PREFIX = "revanced_api_cache_l1";
const L1_CACHE_VALIDITY = 5 * 60 * 1000; // 5 minutes

function l1_key_name(endpoint: string) {
  return `${CACHE_KEY_PREFIX}:${endpoint}`;
}

// Get item from the cache
export function get(endpoint: string) {
  if (!browser) {
    return null;
  }

  const key_name = l1_key_name(endpoint);
  const ls_data: { valid_until: number; data: any } | null = JSON.parse(localStorage.getItem(key_name));

  if (ls_data === null || ls_data.valid_until <= Date.now()) {
    dev_log("Cache", `missed "${endpoint}"`);
    localStorage.removeItem(key_name);
    return null;
  }


  dev_log("Cache", `hit "${endpoint}"`);
  return ls_data.data;
}

// Update the cache
export function update(endpoint: string, data: any) {
  if (!browser) {
    return;
  }

  localStorage.setItem(l1_key_name(endpoint), JSON.stringify({
    data,
    valid_until: Date.now() + L1_CACHE_VALIDITY
  }));
}

// Clear the cache
export function clear() {
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith(CACHE_KEY_PREFIX)) {
      localStorage.removeItem(key);
    }
  }
}
