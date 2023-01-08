<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import type { PageData } from './$types';
	import type { Patch } from '$lib/types';
	import { patches as api_patches } from '$data/api';

	import Meta from '$lib/components/Meta.svelte';
	import PackageMenu from '../PackageMenu.svelte';
	import Package from '../Package.svelte';
	import PatchItem from '../PatchItem.svelte';
	import Footer from '$layout/Footer.svelte';
	import Search from '$lib/components/Search.svelte';
	import FilterChip from '$lib/components/FilterChip.svelte';
	import Dialogue from '$lib/components/Dialogue.svelte';

	$: ({ patches, packages } = $api_patches);

	export let data: PageData;
	$: ({ selectedPkg } = data);

	let searchTerm: string;
	let searchTermFiltered: string;
	let timeout: any = null;
	let mobilePackages = false;

	function filterByPackage(pkg: string | undefined, packageList: any[]) {
		return packageList.find((x: Package) => x.name === pkg);
	}

	function checkPkgName(pkg: string, packageList: any[]) {
		// Basically the same function as before lol
		return packageList.find((x: Package) => x.name.replace(/\./g, '').includes(pkg));
	}

	function search(patch: Patch) {
		return (
			patch.description.toLowerCase().replace(/\s/g, '').includes(searchTermFiltered) ||
			patch.name.toLowerCase().replace(/-/g, '').includes(searchTermFiltered) ||
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

<Meta title="Patches" />

<div class="search">
	<div class="search-contain">
		<!-- Must bind both variables: we get searchTerm from the text input, -->
		<!-- and searchTermFiltered gets cleared with the clear button -->
		<Search
			bind:searchTerm
			bind:searchTermFiltered
			title="Search for patches"
			on:keyup={debounce}
		/>
	</div>
</div>
<main>
	<div class="filter-chips" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
		<FilterChip
			selected={!!selectedPkg}
			dropdown
			on:click={() => (mobilePackages = !mobilePackages)}
		>
			{selectedPkg || 'Packages'}
		</FilterChip>
		<!-- <FilterChip check>Universal</FilterChip>
		<FilterChip>Patch options</FilterChip> -->
	</div>

	<div class="mobile-packages-Dialogue">
		<Dialogue bind:modalOpen={mobilePackages} fullscreen>
			<svelte:fragment slot="title">Packages</svelte:fragment>
			<div class="mobile-packages">
				<span
					on:click={() => (mobilePackages = !mobilePackages)}
					on:keypress={() => (mobilePackages = !mobilePackages)}
				>
					<Package {selectedPkg} name="All packages" />
				</span>
				{#each packages as pkg}
					<span
						on:click={() => (mobilePackages = !mobilePackages)}
						on:keypress={() => (mobilePackages = !mobilePackages)}
					>
						<Package {selectedPkg} name={pkg} />
					</span>
				{/each}
			</div>
		</Dialogue>
	</div>

	<aside in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
		<PackageMenu>
			<span class="packages">
				<Package {selectedPkg} name="All packages" />
				{#each packages as pkg}
					<Package {selectedPkg} name={pkg} />
				{/each}
			</span>
		</PackageMenu>
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
		display: grid;
		grid-template-columns: 300px 3fr;
		width: min(90%, 80rem);
		margin-inline: auto;
		gap: 1.5rem;
	}

	.search {
		padding-top: 5rem;
		padding-bottom: 1.25rem;
		background-color: var(--grey-seven);
	}

	.search-contain {
		width: min(90%, 80rem);
		margin-inline: auto;
	}

	.patches-container {
		overflow: hidden;
		border-radius: 20px;
		margin-top: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
		position: sticky;
		z-index: 1;
		min-height: calc(100vh - 6rem);
		margin-bottom: 3rem;
	}

	.filter-chips {
		display: none;
	}

	.mobile-packages {
		margin-bottom: -1px;
		overflow: hidden;
		border-radius: 12px;
		border: 1px solid var(--grey-three);
	}

	@media (min-width: 768px) {
		.mobile-packages-Dialogue {
			display: none;
		}
	}
	@media (max-width: 768px) {
		main {
			grid-template-columns: none;
			flex-direction: column;
			gap: 0;
		}

		aside {
			display: none;
		}

		.search {
			padding-top: 4.5rem;
		}

		.patches-container {
			margin-top: 1rem;
			margin-bottom: 1.5rem;
			gap: 0.75rem;
		}

		.filter-chips {
			display: flex;
			flex-wrap: wrap;
			margin-top: 1rem;
			gap: 0.75rem;
			padding-bottom: 0rem;
		}
	}
</style>
