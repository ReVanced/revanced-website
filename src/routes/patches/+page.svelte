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
	let searchTermFiltered: string;
	let timeout: any = null;

	const debounce = () => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			searchTermFiltered = searchTerm
				?.replace(/\./g, '')
				.replace(/\s/g, '')
				.replace(/-/g, '')
				.toLowerCase();
		}, 500);
	};

	function search(patch: Patch) {
		function checkPkgName(findTerm: string | boolean, array: any) {
			for (let i = 0; i < array.length; i++) {
				if (array[i].name.replace(/\./g, '').includes(findTerm)) {
					return true;
				}
			}
		}

		return (
			patch.description.toLowerCase().replace(/\s/g, '').includes(searchTermFiltered) ||
			patch.name.replace(/-/g, '').toLowerCase().includes(searchTermFiltered) ||
			checkPkgName(searchTermFiltered, patch.compatiblePackages)
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
		<TreeMenu>
			<Search bind:searchTerm bind:searchTermFiltered title="Search patches" on:keyup={debounce} />
			<span>
				{#each packages as pkg}
					<TreeMenuButton bind:current name={pkg} />
				{/each}
			</span>
		</TreeMenu>
	</aside>

	<div class="patches-container">
		{#each patches as patch}
			{#key current || searchTermFiltered}
				{#if filterByPackage(current, patch.compatiblePackages) || !current}
					{#if search(patch) || !searchTermFiltered}
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
		margin-top: 6.7rem;
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
