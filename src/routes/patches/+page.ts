import type { PageLoad } from './$types';

import { patches } from '../../data/api';

export const load: PageLoad = patches.page_load_impl();
