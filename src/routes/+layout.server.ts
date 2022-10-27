import type { Repository } from 'src/data/types';

import { api_url } from '$lib/utils';

export type ContribData = { repositories: Repository[] };

export const prerender = true;

export async function load({
  fetch
}): Promise<ContribData> {
	const response = await fetch(api_url('contributors'));
	const data = await response.json();
	return data;
};
