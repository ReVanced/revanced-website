<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { Query } from '@tanstack/query-core';
	import Dialog from '$layout/Dialogs/Dialog.svelte';
	import { queries } from '$data/api';
	import { createQuery } from '@tanstack/svelte-query';

	export let dialogOpen: boolean;
	export let warning: string;

	const query = createQuery(queries.manager());
</script>

<Dialog bind:dialogOpen>
	<svelte:fragment slot="title">Warning</svelte:fragment>
	<svelte:fragment slot="description">{warning} Do you still want to download?</svelte:fragment>
	<svelte:fragment slot="buttons">
		<Query {query} let:data>
			<Button type="text" href={data.release.download_url} on:click={() => (dialogOpen = false)}>
				Okay
			</Button>
		</Query>
		<Button type="text" on:click={() => (dialogOpen = false)}>Cancel</Button>
	</svelte:fragment>
</Dialog>
