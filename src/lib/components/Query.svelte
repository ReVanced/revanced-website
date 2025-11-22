<script lang="ts">
	import type { CreateQueryResult } from '@tanstack/svelte-query';
	import { isRestoring } from '../../routes/+layout.svelte';
	// I might try to get this merged into tanstack query.

	let {
		query,
		children,
		error
	}: {
		query: CreateQueryResult<any, any>;
		children?: (data: any) => any;
		error?: any;
	} = $props();
</script>

{#if !$isRestoring}
	{#if query.isSuccess}
		{@render children?.(query.data)}
	{:else if query.isError}
		{@render error?.()}
	{/if}
{/if}
