import { PersistedState } from 'runed';

export const theme = new PersistedState<'light' | 'dark'>('theme', 'light');
