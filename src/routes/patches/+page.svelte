<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import type { Patch } from '$lib/types';
	import { patches as api_patches } from '$data/api';

	import TreeMenu from '$lib/components/TreeView/TreeMenu.svelte';
	import TreeMenuButton from '$lib/components/TreeView/TreeMenuButton.svelte';
	import PatchItem from './PatchItem.svelte';
	import Footer from '$layout/Footer.svelte';
	import Search from '$lib/components/Search.svelte';

	$: ({ patches, packages } = $api_patches);

	let selectedPkg: boolean = false;
	let searchTerm: string;
	let searchTermFiltered: string;
	let timeout: any = null;

	function filterByPackage(selectedPkg: string | boolean, packageList: any) {
		for (let i = 0; i < packageList.length; i++) {
			if (packageList[i].name === selectedPkg) {
				return true;
			}
		}
	}

	function search(patch: Patch) {
		function checkPkgName(selectedPkg: string | boolean, packageList: any) {
			// Basically the same function as before lol
			for (let i = 0; i < packageList.length; i++) {
				if (packageList[i].name.replace(/\./g, '').includes(selectedPkg)) {
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

	// Make sure we don't have filter the patches after every key press
	const debounce = () => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			// Filter search term for better results (i.e. "  Unl O-ck" and "unlock" gives the same results)
			searchTermFiltered = searchTerm
				?.replace(/\./g, '')
				.replace(/\s/g, '')
				.replace(/-/g, '')
				.toLowerCase();
		}, 500);
	};
</script>

<svelte:head>
	<title>ReVanced | Patches</title>
	<meta content="ReVanced | Patches" name="og:title" />
	<meta content="ReVanced | Patches" name="twitter:title" />
</svelte:head>

<main>
	<aside in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
		<TreeMenu>
			<!-- Must bind both variables: we get searchTerm from the text input, -->
			<!-- and searchTermFiltered gets cleared with the clear button -->
			<Search bind:searchTerm bind:searchTermFiltered title="Search patches" on:keyup={debounce} />
			<span class="packages">
				{#each packages as pkg}
					<TreeMenuButton bind:selectedPkg name={pkg} />
				{/each}
			</span>
		</TreeMenu>
	</aside>

	<div class="patches-container">
		{#each patches as patch}
			<!-- Trigger new animations when package or search changes (I love Svelte) -->
			{#key selectedPkg || searchTermFiltered}
				<!-- Show patch if it supports the selected package, or if no package has been selected -->
				{#if filterByPackage(selectedPkg, patch.compatiblePackages) || !selectedPkg}
					<!-- ...same with search -->
					{#if search(patch) || !searchTermFiltered}
						<div in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
							<PatchItem {patch} />
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
		width: min(98%, 82rem);
		gap: 1.5rem;
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

	@media (max-width: 768px) {
		main {
			grid-template-columns: none;
			flex-direction: column;
			margin-top: 4rem;
			gap: 0;
		}

		.patches-container {
			padding-left: 0.75rem;
			padding-bottom: 1.25rem;
			margin-top: 0;
			gap: 0.75rem;
		}

		.packages {
			display: flex;
			flex-direction: column;
			flex-wrap: wrap;
			height: 2.75rem;
			gap: 0.5rem;
			overflow-x: scroll;
		}

		.packages::-webkit-scrollbar {
			display: none;
		}
	}
</style>
