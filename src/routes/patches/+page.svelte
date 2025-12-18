<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { fly, fade, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Fuse, { type FuseResult } from 'fuse.js';
	import Page from '$components/molecules/Page.svelte';
	import Search from '$components/atoms/Search.svelte';
	import FilterChip from '$components/atoms/FilterChip.svelte';
	import PackageMenu from '$components/organisms/PackageMenu.svelte';
	import PackageItem from '$components/molecules/PackageItem.svelte';
	import PatchItem from '$components/molecules/PatchItem.svelte';
	import Modal from '$components/molecules/Modal.svelte';
	import { patchesQuery } from '$stores';
	import { debounce } from '$lib/utils/debounce';
	import type { Patch } from '$api';

	const schemas = [
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://revanced.app/' },
				{ '@type': 'ListItem', position: 2, name: 'Patches', item: 'https://revanced.app/patches' }
			]
		}
	];

	const patches = $derived(patchesQuery.data ?? []);

	const fuse = $derived(
		new Fuse(patches, {
			keys: ['name', 'description'],
			threshold: 0.3,
			ignoreLocation: true
		})
	);

	const packages = $derived.by(() => {
		const patchCountByPackage: Record<string, number> = {};

		for (const patch of patches) {
			if (patch.compatiblePackages) {
				for (const pkgName of Object.keys(patch.compatiblePackages)) {
					patchCountByPackage[pkgName] = (patchCountByPackage[pkgName] ?? 0) + 1;
				}
			}
		}

		// Sort by patch count descending so most relevant apps appear first
		return Object.keys(patchCountByPackage).sort(
			(a, b) => patchCountByPackage[b] - patchCountByPackage[a]
		);
	});

	let selectedPkg = $state<string | null>(page.url.searchParams.get('pkg'));
	let searchTerm = $state(page.url.searchParams.get('s') ?? '');
	let mobilePackagesOpen = $state(false);

	const updateUrl = debounce(() => {
		const params = new URLSearchParams();
		if (selectedPkg) params.set('pkg', selectedPkg);
		if (searchTerm) params.set('s', searchTerm);
		const queryString = params.toString();
		goto(queryString ? `?${queryString}` : '/patches', { replaceState: true, keepFocus: true });
	}, 350);

	$effect(() => {
		selectedPkg;
		searchTerm;
		updateUrl();
	});

	function getCompatiblePackageNames(patch: Patch): string {
		if (!patch.compatiblePackages) return '';
		return Object.keys(patch.compatiblePackages).join(' ');
	}

	function getCompatibleVersions(patch: Patch): string {
		if (!patch.compatiblePackages) return '';
		return Object.values(patch.compatiblePackages)
			.filter((versions): versions is string[] => versions !== null)
			.flat()
			.join(' ');
	}

	function filterPatches(patchList: Patch[], pkg: string | null, search: string): Patch[] {
		let filtered = patchList;

		if (pkg) {
			filtered = filtered.filter((patch) => {
				if (!patch.compatiblePackages) return false;
				return Object.keys(patch.compatiblePackages).includes(pkg);
			});
		}

		if (search) {
			const fuseInstance = new Fuse(filtered, {
				keys: [
					'name',
					'description',
					{ name: 'packageNames', getFn: getCompatiblePackageNames },
					{ name: 'versions', getFn: getCompatibleVersions }
				],
				threshold: 0.3,
				ignoreLocation: true
			});
			const results: FuseResult<Patch>[] = fuseInstance.search(search);
			filtered = results.map((r) => r.item);
		}

		return filtered;
	}

	function selectPackage(pkgName: string | null) {
		selectedPkg = pkgName && pkgName !== 'All packages' ? pkgName : null;
		window.scrollTo({ top: 0, behavior: 'smooth' });
		mobilePackagesOpen = false;
	}

	function toggleMobilePackages() {
		mobilePackagesOpen = !mobilePackagesOpen;
	}

	let filteredPatches = $derived(filterPatches(patches, selectedPkg, searchTerm));
</script>

<Page title="Patches for ReVanced" description="Browse our rich collection of patches for ReVanced" {schemas}>
	<div class="search-bar">
		<div class="search-contain">
			<Search
				bind:value={searchTerm}
				placeholder="Search for patches"
			/>
		</div>
	</div>

	{#if patchesQuery.loading && patches.length === 0}
		<div class="loading-state">
			<p>Loading patches...</p>
		</div>
	{:else if patchesQuery.error && patches.length === 0}
		<div class="error-state">
			<p>Failed to load patches. Please try again later.</p>
		</div>
	{:else if patches.length > 0}
	<main>
		<div class="filter-chips" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
			<FilterChip
				selected={!!selectedPkg}
				dropdown
				onclick={toggleMobilePackages}
			>
				{selectedPkg || 'Packages'}
			</FilterChip>
		</div>

		<aside in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
			<PackageMenu>
				<PackageItem
					name="All packages"
					selected={!selectedPkg}
					onclick={() => selectPackage(null)}
				/>
				{#each packages as pkg}
					<PackageItem
						name={pkg}
						selected={selectedPkg === pkg}
						onclick={() => selectPackage(pkg)}
					/>
				{/each}
			</PackageMenu>
		</aside>

		<div class="patches-container">
			{#key selectedPkg || searchTerm}
				{#each filteredPatches as patch, i (patch.name + (patch.compatiblePackages ? Object.keys(patch.compatiblePackages)[0] ?? '' : ''))}
					<div in:fly={{ y: 10, easing: quintOut, duration: 750, delay: Math.min(i * 30, 300) }}>
						<PatchItem {patch} />
					</div>
				{/each}
			{/key}

			{#if filteredPatches.length === 0}
				<div class="no-results">
					<p>No patches found matching your criteria.</p>
				</div>
			{/if}
		</div>
	</main>
	{/if}
</Page>

{#if patches.length > 0 || patchesQuery.hasData}
<Modal bind:open={mobilePackagesOpen} title="Packages" fullscreen>
	<div class="mobile-packages">
		<PackageItem
			name="All packages"
			selected={!selectedPkg}
			onclick={() => selectPackage(null)}
		/>
		{#each packages as pkg}
			<PackageItem
				name={pkg}
				selected={selectedPkg === pkg}
				onclick={() => selectPackage(pkg)}
			/>
		{/each}
	</div>
</Modal>
{/if}

<style>
	.search-bar {
		padding-top: 0.6rem;
		padding-bottom: 1.25rem;
		background-color: var(--surface-eight);
	}

	.search-contain {
		width: min(90%, 80rem);
		margin-inline: auto;
	}

	main {
		display: grid;
		grid-template-columns: 300px 3fr;
		width: min(90%, 80rem);
		margin-inline: auto;
		gap: 1.5rem;
	}

	.filter-chips {
		display: none;
	}

	aside {
		display: block;
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

	.no-results {
		text-align: center;
		padding: 3rem;
		color: var(--text-four);
	}

	.loading-state,
	.error-state {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 200px;
		width: min(90%, 80rem);
		margin-inline: auto;
		padding: 3rem;
		text-align: center;
		color: var(--text-four);
	}

	.mobile-packages {
		margin-bottom: -1px;
		overflow: hidden;
		border-radius: 12px;
		border: 1px solid var(--border);
	}

	@media (max-width: 768px) {
		main {
			display: flex;
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
		}
	}
</style>
