<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import type { CompatiblePackage } from 'src/data/types';
	import { patches as api_patches } from '../../data/api';

	import TreeMenu from '$lib/components/molecules/TreeMenu.svelte';
	import TreeMenuButton from '$lib/components/atoms/TreeMenuButton.svelte';
	import PatchCell from '$lib/components/molecules/PatchCell.svelte';
	import Footer from '$lib/components/molecules/Footer.svelte';

	$: ({ patches, packages } = $api_patches);

	let current: boolean = false;

	function search(findTerm: string | boolean, array: any) {
		for (let i = 0; i < array.length; i++) {
			if (array[i].name === findTerm) {
				return true;
			}
		}
		return false;
	}
</script>

<svelte:head>
	<title>ReVanced | Patches</title>
	<meta content="ReVanced | Patches" name="og:title" />
	<meta content="ReVanced | Patches" name="twitter:title" />
</svelte:head>

<main>
	<aside in:fly={{ y: 10, easing: quintOut, duration: 750, delay: 100 }}>
		<TreeMenu title="packages">
			{#each packages as pkg}
				<TreeMenuButton bind:current name={pkg} />
			{/each}
		</TreeMenu>
	</aside>

	<div class="patches-container">
		{#each patches as patch}
			{#key current}
				{#if search(current, patch.compatiblePackages) || !current}
					<div in:fly={{ x: 10, easing: quintOut, duration: 750, delay: 100 }}>
						<PatchCell bind:current {patch} />
					</div>
				{/if}
			{/key}
		{/each}
	</div>
</main>
<Footer />

<style>
	main {
		margin-inline: auto;
		padding: 0 2rem;
		display: grid;
		grid-template-columns: 300px 3fr;
		gap: 1.5rem;
		padding-bottom: 3rem;
	}

	.patches-container {
		margin-top: 7rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
		position: sticky;
		z-index: 1;
		min-height: calc(100vh - 7rem);
	}
</style>
