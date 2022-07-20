<script>
	import DownloadChannel from '../atoms/DownloadChannel.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let items = ['Stable', 'Development'];

	export let activeTab = 'Stable';

	$: handleTabChange = (item) => {
		activeTab = item;
	};
</script>

<div class="download-selection">
	{#each items as item}
		<DownloadChannel active={item === activeTab} 
			on:click={handleTabChange(item)}>
				{item}
		</DownloadChannel>
	{/each}
</div>

<style>
	.download-selection {
		background-color: var(--grey-one);
		border-radius: 200px;
		display: flex;
		padding: 8px 8px;
        display: grid;
		grid-template-columns: 1fr 1fr;
	}
</style>
