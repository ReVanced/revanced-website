import type { PageLoad } from './$types';

import { contributors } from '../data/api';

export const prerender = true;

export const load: PageLoad = contributors.page_load_impl();
