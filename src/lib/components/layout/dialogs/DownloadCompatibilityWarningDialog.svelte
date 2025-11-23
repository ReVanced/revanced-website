<script lang="ts">
	import Button from '$ui/Button.svelte';
	import Query from '$lib/components/Query.svelte';
	import Dialog from '$layout/dialogs/Dialog.svelte';
	import { queries } from '$data/api';
	import { createQuery } from '@tanstack/svelte-query';

	let {
		dialogOpen = $bindable(false),
		warning
	}: {
		dialogOpen?: boolean;
		warning: string;
	} = $props();

	const query = createQuery(() => queries.manager());
</script>

<Dialog bind:dialogOpen>
	{#snippet title()}Warning{/snippet}
	{#snippet description()}{warning} Do you still want to download?{/snippet}
	{#snippet buttons()}
		<Query {query}>
			{#snippet children(data)}
				{#if data && typeof data === 'object' && 'release' in data && data.release && 'download_url' in data.release}
					<Button type="text" href={(data as any).release.download_url} onclick={() => (dialogOpen = false)}>
						Okay
					</Button>
				{/if}
			{/snippet}
		</Query>
		<Button type="text" onclick={() => (dialogOpen = false)}>Cancel</Button>
	{/snippet}
</Dialog>
