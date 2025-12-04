import { PersistedState } from 'runed';

export const theme = new PersistedState<'light' | 'dark'>('theme', 'light');

export const readBannerIds = new PersistedState<string[]>('read_banner_ids', []);
