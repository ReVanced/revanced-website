<script lang="ts" generics="TData, TError">
	import type { CreateQueryResult } from '@tanstack/svelte-query';
	import { isRestoring } from '../../routes/+layout.svelte';
	import type { Snippet } from 'svelte';

	let {
		query,
		children,
		error
	}: {
		query: CreateQueryResult<TData, TError>;
		children?: Snippet<[TData]>;
		error?: Snippet;
	} = $props();
</script>

{#if !$isRestoring}
	{#if query.isSuccess}
		{@render children?.(query.data)}
	{:else if query.isError}
		{@render error?.()}
	{/if}
{/if}
