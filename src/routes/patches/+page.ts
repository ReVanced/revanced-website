import { patches } from '$data/api';
import type { PageLoad } from './$types';

export const load: PageLoad = patches.page_load_impl();
