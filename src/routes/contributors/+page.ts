import { repositories } from '$data/api';
import type { PageLoad } from './$types';

export const load: PageLoad = repositories.page_load_impl();
