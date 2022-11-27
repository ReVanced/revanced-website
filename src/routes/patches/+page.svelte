<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import type { Patch } from 'src/data/types';
	import { patches as api_patches } from '../../data/api';

	import TreeMenu from '$lib/components/molecules/TreeMenu.svelte';
	import TreeMenuButton from '$lib/components/atoms/TreeMenuButton.svelte';
	import PatchCell from '$lib/components/molecules/PatchCell.svelte';
	import Footer from '$lib/components/molecules/Footer.svelte';
	import Search from '$lib/components/atoms/Search.svelte';

	$: ({ patches, packages } = $api_patches);

	let current: boolean = false;
	let searchTerm: string;
	$: searchTermLowerCase = searchTerm?.toLowerCase();

	function search(patch: Patch) {
		function checkPkgName(findTerm: string | boolean, array: any) {
			for (let i = 0; i < array.length; i++) {
				if (array[i].name.includes(findTerm)) {
					return true;
				}
			}
		}

		return (
			patch.description.toLowerCase().includes(searchTermLowerCase) ||
			patch.name.replace(/-/g, ' ').toLowerCase().includes(searchTermLowerCase) ||
			checkPkgName(searchTermLowerCase, patch.compatiblePackages)
		);
	}

	function filterByPackage(findTerm: string | boolean, array: any) {
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
		<TreeMenu title="Search patches...">
			<Search bind:searchTerm title="Search patches" />
			<span>
				{#each packages as pkg}
					<TreeMenuButton bind:current name={pkg} />
				{/each}
			</span>
		</TreeMenu>
	</aside>

	<div class="patches-container">
		{#each patches as patch}
			{#key current || searchTerm}
				{#if filterByPackage(current, patch.compatiblePackages) || !current}
					{#if search(patch) || !searchTerm}
						<div in:fly={{ x: 10, easing: quintOut, duration: 750, delay: 100 }}>
							<PatchCell bind:current {patch} />
						</div>
					{/if}
				{/if}
			{/key}
		{/each}
	</div>
</main>
<Footer />

<style>
	main {
		margin-inline: auto;
		display: grid;
		grid-template-columns: 300px 3fr;
		width: min(98%, 90rem);
		gap: 1.5rem;
	}

	aside {
		padding-left: 0.75rem;
	}

	.patches-container {
		margin-top: 6rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
		position: sticky;
		z-index: 1;
		min-height: calc(100vh - 6rem);
		padding-bottom: 3rem;
		padding-right: 0.75rem;
	}
</style>
