<script>
	import DownloadSelection from '../atoms/DownloadSelection.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let items = ['Manager', 'CLI', 'Patches', 'Integrations'];

	export let activeTab = 'Manager';

	$: handleTabChange = (item) => {
		activeTab = item;
	};
</script>

<div class="download-selection">
	{#each items as item}
		<DownloadSelection active={item === activeTab} 
			on:click={handleTabChange(item)}>
				{item}
		</DownloadSelection>
	{/each}
</div>

<style>
	.download-selection {
		background-color: var(--grey-one);
		border-radius: 200px;
		display: flex;
		justify-content: space-between;
		padding: 8px 8px;
	}
</style>
