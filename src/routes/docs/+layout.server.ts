import type { PageServerLoad } from './$types';

import { index_content } from '$lib/documentation.server';

// The load function here used to get data from a json file created by a (prerendered) server route.
// This was because we could not prerender the documentation route before.
// If you can no longer prerender the docs, then you are going to have to move the load functions here to a prerendered server route like before and fetch them here.
export const prerender = true;

export const load: PageServerLoad = () => ({ tree: index_content() });
