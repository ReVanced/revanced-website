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

<div class="download-channel">
	{#each items as item}
		<DownloadChannel active={item === activeTab} 
			on:click={handleTabChange(item)}>
				{item}
		</DownloadChannel>
	{/each}
</div>

<style>
	.download-channel {
		background-color: var(--grey-one);
		border-radius: 200px;
		padding: 0.5rem 0.5rem;
        display: grid;
		grid-template-columns: 1fr 1fr;
		gap:1rem;
	}
</style>
