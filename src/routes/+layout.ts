import type { Repository } from '$lib/types';

export type APIOutput = { repositories: Repository[] };

export async function load({
  fetch
}): APIOutput {
  const response = await fetch('https://releases.rvcd.win/contributors');
  return await response.json();
}
