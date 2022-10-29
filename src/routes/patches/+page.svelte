<script lang="ts">
  import type { PageData } from './$types';

	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import type { CompatiblePackage } from 'src/data/types';
  import { patches as api_patches } from '../../data/api';

	import TreeMenu from '$lib/components/molecules/TreeMenu.svelte';
	import TreeMenuButton from '$lib/components/atoms/TreeMenuButton.svelte';
	import PatchCell from '$lib/components/molecules/PatchCell.svelte';
	import Footer from '$lib/components/molecules/Footer.svelte';

	export let data: PageData;
  // Needed when someone navigates directly to the page.
  api_patches.init(data);

	$: ({ patches, packages } = $api_patches);

	let current: boolean = false;

	function search(findTerm: string | boolean, array: CompatiblePackage[]) {
		for (let i = 0; i < array.length; i++) {
			if (array[i].name === findTerm) {
				return true;
			}
		}
		return false;
	}
</script>

<svelte:head>
	<title>Revanced - Patches</title>
	<meta content="Revanced - Patches" name="og:title" />
	<meta content="Revanced - Patches" name="twitter:title" />
</svelte:head>

<main>
	<aside in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
		<TreeMenu title="packages">
			{#each packages as pkg}
				<TreeMenuButton bind:current name={pkg} />
			{/each}
		</TreeMenu>
	</aside>

	<div class="patches-container">
		{#each patches as patch, i}
			{#if search(current, patch.compatiblePackages) || !current}
				<div in:fly={{ x: 10, easing: quintOut, duration: 750, delay: -(300 * 0.85 ** i) + 300 }}>
					<PatchCell bind:current {patch} />
				</div>
			{/if}
		{/each}
	</div>
</main>
<Footer {...data} />

<style>
	main {
		margin-inline: auto;
		width: min(95%, 100rem);
		display: grid;
		grid-template-columns: 300px 3fr;
		gap: 1.5rem;
		padding-bottom: 3rem;
	}

	.patches-container {
		margin-top: 7.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
		position: sticky;
		z-index: 1;
		min-height: calc(100vh - 7.5rem);
	}
</style>
