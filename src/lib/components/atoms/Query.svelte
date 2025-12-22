<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { QueryResult } from '$stores';
	import { hydrationState } from '$stores';
	import Spinner from './Spinner.svelte';

	type Props<T> = {
		query: QueryResult<T>;
		children: Snippet<[T]>;
		loading?: Snippet;
		error?: Snippet<[Error]>;
		showSpinner?: boolean;
	};

	let {
		query,
		children,
		loading,
		error,
		showSpinner = true
	}: Props<any> = $props();

	let isRestoring = $derived(hydrationState.isRestoring);
	let isLoading = $derived(query.loading);
	let hasError = $derived(query.error !== null);
	let hasData = $derived(query.data !== null);
</script>

{#if isRestoring}
	<!-- Wait for cache restoration before rendering -->
{:else if isLoading}
	{#if loading}
		{@render loading()}
	{:else if showSpinner}
		<Spinner />
	{/if}
{:else if hasError && !hasData}
	{#if error}
		{@render error(query.error!)}
	{/if}
{:else if hasData}
	{@render children(query.data)}
{/if}
