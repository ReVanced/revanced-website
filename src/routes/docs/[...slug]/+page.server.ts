import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

import { get } from '$lib/documentation.server';

// See also: ../+layout.server.ts
export const prerender = true;

export const load: PageServerLoad = ({ params }) => {
  const document = get(params.slug);
  if (document === null) {
    error
    throw error(404);
  }

  return document;
}
