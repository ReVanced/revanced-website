import { getApiBaseUrl } from '$lib/config/settings';

export type HttpOptions = {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  // future: auth tokens, retries, etc.
};

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function joinUrl(base: string, path: string): string {
  if (!path) return base;
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

export async function get<T>(path: string, opts: HttpOptions = {}): Promise<T> {
  const url = joinUrl(getApiBaseUrl(), path);
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'accept': 'application/json', ...(opts.headers ?? {}) },
    signal: opts.signal
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new HttpError(res.status, text || res.statusText);
  }
  return (await res.json()) as T;
}

export async function post<TBody, TResp>(path: string, body: TBody, opts: HttpOptions = {}): Promise<TResp> {
  const url = joinUrl(getApiBaseUrl(), path);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'accept': 'application/json', ...(opts.headers ?? {}) },
    body: JSON.stringify(body),
    signal: opts.signal
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new HttpError(res.status, text || res.statusText);
  }
  return (await res.json()) as TResp;
}
