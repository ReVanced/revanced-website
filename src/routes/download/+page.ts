import type { PageLoad } from './$types';

import { tools } from '$data/api';

export const load: PageLoad = tools.page_load_impl();
