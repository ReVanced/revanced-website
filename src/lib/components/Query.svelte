<script lang="ts">
	import type { QueryObserverResult } from '@tanstack/svelte-query';
	import type { Readable } from 'svelte/store';
	import { isRestoring } from '../../routes/+layout.svelte';
	// I might try to get this merged into tanstack query.

	// So basically, this is how you do generics here.
	//https://github.com/sveltejs/language-tools/issues/273#issuecomment-1003496094
	type T = $$Generic;
	interface $$Slots {
		default: {
			// slot name
			data: T;
		};
		loading?: {};
		error: {};
	}

	export let query: Readable<QueryObserverResult<T, any>>;
</script>

{#if !$isRestoring}
	{#if $query.status === 'success'}
		<slot data={$query.data} />
	{:else if $query.status === 'error'}
		<slot name="error" />
	{:else if $query.status === 'pending'}
		<slot name="loading" />
	{/if}
{/if}
