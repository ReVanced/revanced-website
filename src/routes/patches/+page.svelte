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
	import { modalsStack } from '$stores/modals.svelte';
	import { patchesQuery } from '$stores';
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
		const pkgSet = new Set<string>();
		for (const patch of patches) {
			if (patch.compatiblePackages) {
				for (const pkgName of Object.keys(patch.compatiblePackages)) {
					pkgSet.add(pkgName);
				}
			}
		}
		return Array.from(pkgSet).sort();
	});

	let selectedPkg = $state<string | null>(page.url.searchParams.get('pkg'));
	let searchTerm = $state(page.url.searchParams.get('s') ?? '');

	let showAllVersions = $state(false);
	const mobilePackagesModalId = 'mobile-packages';

	function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
		let timeoutId: ReturnType<typeof setTimeout>;
		return ((...args: unknown[]) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => fn(...args), delay);
		}) as T;
	}

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
				keys: ['name', 'description'],
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

		modalsStack.close(mobilePackagesModalId);
	}

	function toggleMobilePackages() {
		if (modalsStack.isOpen(mobilePackagesModalId)) {
			modalsStack.close(mobilePackagesModalId);
		} else {
			modalsStack.open(mobilePackagesModalId);
		}
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

	{#if patches.length > 0}
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
						<PatchItem
							{patch}
							{showAllVersions}
							onToggleVersions={() => (showAllVersions = !showAllVersions)}
						/>
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

{#if patches.length > 0}
<Modal modalId={mobilePackagesModalId} title="Packages" fullscreen>
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
