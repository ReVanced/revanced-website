import type { Snippet } from 'svelte';

export type WithChildren = { children: Snippet };
export type WithOptionalChildren = Partial<WithChildren>;
