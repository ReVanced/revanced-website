import { browser } from "$app/environment";

const URL_KEY = "revanced_api_url";

// Get base URL
export function api_base_url(): string {
  const default_base_url = "https://releases.revanced.app";
  if (browser) {
    return localStorage.getItem(URL_KEY) || default_base_url;
  }

  return default_base_url;
}

// (re)set base URL.
export function set_api_base_url(url?: string) {
  if (!url) {
    localStorage.removeItem(URL_KEY);
  } else {
    localStorage.setItem(URL_KEY, url);
  }
}
