<script lang="ts">
	import { building } from '$app/environment';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { derived, readable, type Readable } from 'svelte/store';
	import { page } from '$app/stores';

	import type { CompatiblePackage, Patch } from '$lib/types';

	import { createQuery } from '@tanstack/svelte-query';
	import { queries } from '$data/api';

	import Head from '$lib/components/Head.svelte';
	import PackageMenu from './PackageMenu.svelte';
	import Package from './Package.svelte';
	import PatchItem from './PatchItem.svelte';
	import Search from '$lib/components/Search.svelte';
	import FilterChip from '$lib/components/FilterChip.svelte';
	import MobilePatchesPackagesDialog from '$layout/Dialogs/MobilePatchesPackagesDialog.svelte';
	import Query from '$lib/components/Query.svelte';
	import Fuse from 'fuse.js';
	import { onMount } from 'svelte';
	import createFilter from '$util/filter';
	import { debounce } from '$util/debounce';

	const query = createQuery(queries.patches());

	let searchParams: Readable<URLSearchParams>;
	if (building) {
		searchParams = readable(new URLSearchParams());
	} else {
		searchParams = derived(page, ($page) => $page.url.searchParams);
	}

	$: selectedPkg = $searchParams.get('pkg');
	let searchTerm = $searchParams.get('s') || '';

	let mobilePackages = false;
	let showAllVersions = false;

	function filterPatches(patches: Patch[], pkg: string, search?: string): Patch[] {
		const patchFilter = createFilter(patches, {
			searcherOptions: {
				keys: ['name', 'description', 'compatiblePackages.name', 'compatiblePackages.versions']
			},
			additionalFilter: (patch: Patch, pkg: string): boolean => {
				if (!pkg) return true;
				return (
					patch.compatiblePackages?.some(
						(compatiblePackage: CompatiblePackage) =>
							compatiblePackage.name === pkg || compatiblePackage.versions?.includes(pkg)
					) || false
				);
			}
		});

		return patchFilter(pkg, search);
	}

	// Make sure we don't have to filter the patches after every key press
	let displayedTerm = '';
	const update = () => {
		displayedTerm = searchTerm;

		const url = new URL(window.location.href);
		url.pathname = '/patches';

		if (searchTerm) {
			url.searchParams.set('s', searchTerm);
		} else {
			url.searchParams.delete('s');
		}

		window.history.pushState(null, '', url);
	};

	onMount(update);
</script>

<Head
	title="Patches for ReVanced"
	description="Browse our rich collection of patches for ReVanced you can use to patch your favourite apps."
	schemas={[
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Home',
					item: 'https://revanced.app/'
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Patches',
					item: 'https://revanced.app/patches'
				}
			]
		}
	]}
/>

<div class="search">
	<div class="search-contain">
		<!-- Must bind both variables: we get searchTerm from the text input, -->
		<Search
			bind:searchTerm
			bind:displayedTerm
			title="Search for patches"
			on:keyup={debounce(update)}
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
	</div>

	<Query {query} let:data>
		<MobilePatchesPackagesDialog
			bind:dialogOpen={mobilePackages}
			bind:searchTerm
			{data}
			{selectedPkg}
		/>

		<aside in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
			<PackageMenu>
				<span class="packages">
					<Package {selectedPkg} name="All packages" bind:searchTerm />
					{#each data.packages as pkg}
						<Package {selectedPkg} name={pkg} bind:searchTerm />
					{/each}
				</span>
			</PackageMenu>
		</aside>

		<div class="patches-container">
			{#each filterPatches(data.patches, selectedPkg || '', displayedTerm) as patch}
				{#key selectedPkg || displayedTerm}
					<div in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
						<PatchItem {patch} bind:showAllVersions />
					</div>
				{/key}
			{/each}
		</div>
	</Query>
</main>

<style>
	main {
		display: grid;
		grid-template-columns: 300px 3fr;
		width: min(90%, 80rem);
		margin-inline: auto;
		gap: 1.5rem;
	}

	.search {
		padding-top: 0.6rem;
		padding-bottom: 1.25rem;
		background-color: var(--surface-eight);
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

	@media (max-width: 767px) {
		main {
			grid-template-columns: none;
			flex-direction: column;
			gap: 0;
		}

		aside {
			display: none;
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
