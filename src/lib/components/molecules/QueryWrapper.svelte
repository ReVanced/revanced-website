<script lang="ts" generics="TData">
	import type { Snippet } from 'svelte';
	import type { QueryResult } from '$stores';
	import ErrorBoundary from './ErrorBoundary.svelte';
	import Spinner from '$components/atoms/Spinner.svelte';

	interface QueryLike<T> {
		readonly data: T | null;
		readonly loading: boolean;
		readonly error: Error | null;
		refetch?: () => Promise<T>;
	}

	interface Props {
		query: QueryLike<TData>;
		children: Snippet<[TData]>;
		loading?: Snippet;
		error?: Snippet<[{ error: Error | null; retry: () => void }]>;
		useSpinner?: boolean;
		compactError?: boolean;
	}

	let {
		query,
		children,
		loading,
		error,
		useSpinner = false,
		compactError = false
	}: Props = $props();

	let isLoading = $derived(query.loading);
	let isError = $derived(!!query.error);
	let queryError = $derived(query.error);
	let data = $derived(query.data);
	let isRefetching = $state(false);

	async function handleRetry() {
		if (query.refetch) {
			isRefetching = true;
			try {
				await query.refetch();
			} finally {
				isRefetching = false;
			}
		}
	}
</script>

{#if isLoading}
	{#if loading}
		{@render loading()}
	{:else if useSpinner}
		<div class="query-wrapper__loading">
			<Spinner />
		</div>
	{:else}
		<div class="query-wrapper__loading">
			<Spinner />
		</div>
	{/if}
{:else if isError}
	<ErrorBoundary
		{isError}
		error={queryError}
		onRetry={handleRetry}
		isRetrying={isRefetching}
		compact={compactError}
		fallback={error}
	/>
{:else if data !== undefined && data !== null}
	{@render children(data)}
{/if}

<style>
	.query-wrapper__loading {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 3rem;
		min-height: 200px;
	}
</style>
