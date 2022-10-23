import { readable } from 'svelte/store';
import type { Repository } from '$lib/types';

export type ContribData = { repositories: Repository[] };

const fetchContributors = async (): Promise<ContribData> => {
	const response = await fetch('https://releases.rvcd.win/contributors');
  	const data = await response.json();
	return data; 
};

export const ContributorsStore = readable(fetchContributors());


