import type { PageLoad } from './$types';

import { repositories } from '../../data/api';

export const load: PageLoad = repositories.page_load_impl();
