import type { Repository } from 'src/data/types';

export type ContribData = { repositories: Repository[] };

export const prerender = true;

export async function load({
  fetch
}): Promise<ContribData> {
	const response = await fetch('https://releases.rvcd.win/contributors');
	const data = await response.json();
	return data;
};
