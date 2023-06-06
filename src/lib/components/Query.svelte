<script lang="ts">
	import type { CreateQueryResult } from '@tanstack/svelte-query';
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
	}

	// TODO: errors

	export let query: CreateQueryResult<T, any>;
</script>

{#if !$isRestoring}
	{#if $query.isSuccess}
		<slot data={$query.data} />
	{:else if $query.isError}
		<slot name="error" />
	{/if}
{/if}
