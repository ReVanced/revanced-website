import type { PageLoad } from './$types';

import { repositories } from '../data/api';

export const prerender = true;

const base = repositories.page_load_impl();

export const load: PageLoad = async ({ fetch }) => {
  // The entire site may softlock if the user sets a bad API url if we don't do this.
  try {
    return await base({ fetch });
  } catch(_) { }
}
