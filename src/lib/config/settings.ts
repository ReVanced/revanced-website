// Settings model: API base URL and feature flags with persistence.
// Uses localStorage when available; falls back to in-memory defaults for SSR.

const STORAGE_KEY = 'rv.settings';

export type Settings = {
  apiBaseUrl: string;
  allowAnalytics: boolean;
};

const DEFAULTS: Settings = {
  apiBaseUrl: 'https://api.revanced.app',
  allowAnalytics: false
};

let cache: Settings | null = null;

function read(): Settings {
  if (cache) return cache;
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        cache = { ...DEFAULTS, ...JSON.parse(raw) };
        return cache!;
      }
    }
  } catch {}
  cache = { ...DEFAULTS };
  return cache!;
}

function write(next: Settings) {
  cache = next;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  } catch {}
}

export function getSettings(): Settings {
  return read();
}

export function setSettings(partial: Partial<Settings>) {
  const curr = read();
  write({ ...curr, ...partial });
}

export function resetSettings() {
  write({ ...DEFAULTS });
}

export function getApiBaseUrl(): string {
  return read().apiBaseUrl;
}

export function setApiBaseUrl(url: string) {
  setSettings({ apiBaseUrl: url });
}

export function getAllowAnalytics(): boolean {
  return read().allowAnalytics;
}

export function setAllowAnalytics(value: boolean) {
  setSettings({ allowAnalytics: value });
}
