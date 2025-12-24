<script lang="ts">
	import { slide, fly } from 'svelte/transition';
	import { quintIn, quintOut } from 'svelte/easing';
	import { browser } from '$app/environment';
	import { goto, replaceState } from '$app/navigation';
	import { page } from '$app/stores';
	import Fuse, { type FuseResult } from 'fuse.js';
	import Page from '$components/molecules/Page.svelte';
	import Search from '$components/atoms/Search.svelte';
	import TagsFilter from '$components/molecules/TagsFilter.svelte';
	import AnnouncementCard from '$components/molecules/AnnouncementCard.svelte';
	import IconChevron from 'virtual:icons/material-symbols/keyboard-arrow-down';
	import { announcementsQuery, announcementTagsQuery, readAnnouncements } from '$stores';
	import { debounce } from '$lib/utils/debounce';
	import { isArchived } from '$lib/utils/announcement';
	import type { Announcement } from '$api';

	const initialParams = browser ? new URL(window.location.href).searchParams : new URLSearchParams();
	let searchTerm = $state(initialParams.get('s') ?? '');
	let displayedTerm = $state(initialParams.get('s') ?? '');
	let selectedTags = $state<string[]>(initialParams.getAll('tag'));
	let archiveExpanded = $state(false);

	$effect(() => {
		if (!browser) return;
		
		const urlTags = $page.url.searchParams.getAll('tag');
		if (JSON.stringify(urlTags) !== JSON.stringify(selectedTags)) {
			selectedTags = urlTags;
		}
	});

	const debouncedUpdate = debounce(() => {
		displayedTerm = searchTerm;
		syncUrlWithSearch();
	});

	function syncUrlWithSearch() {
		if (!browser) return;

		const url = new URL($page.url);
		url.pathname = '/announcements';

		if (searchTerm.trim()) {
			url.searchParams.set('s', searchTerm.trim());
		} else {
			url.searchParams.delete('s');
		}

		replaceState(url.pathname + url.search, {});
	}

	let announcements = $derived(announcementsQuery.data ?? []);

	let allTags = $derived(
		(announcementTagsQuery.data ?? []).map(tag => tag.name)
	);

	let activeItems = $derived(
		announcements.filter((item: Announcement) => !isArchived(item.archived_at))
	);

	let archivedItems = $derived(
		announcements.filter((item: Announcement) => isArchived(item.archived_at))
	);

	function applyFilters(items: Announcement[]) {
		let result = items;

		if (displayedTerm.trim()) {
			const fuse = new Fuse(items, {
				keys: ['title', 'content'],
				threshold: 0.3,
				shouldSort: true
			});
			result = fuse.search(displayedTerm).map((r: FuseResult<Announcement>) => r.item);
		}

		if (selectedTags.length > 0) {
			result = result.filter((item: Announcement) =>
				selectedTags.some((tag) => item.tags?.includes(tag) ?? false)
			);
		}

		return result;
	}

	let filteredActive = $derived(applyFilters(activeItems));
	let filteredArchived = $derived(applyFilters(archivedItems));

	let isLoading = $derived(announcementsQuery.loading);

	function onTagSelect(tag: string) {
		const url = new URL(window.location.href);
		const params = url.searchParams;

		if (params.getAll('tag').includes(tag)) {
			const allTags = params.getAll('tag').filter((t) => t !== tag);
			params.delete('tag');
			allTags.forEach((t) => params.append('tag', t));
		} else {
			params.append('tag', tag);
		}

		goto(url.pathname + '?' + params.toString(), { keepFocus: true });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function toggleArchive() {
		archiveExpanded = !archiveExpanded;
	}

	$effect(() => {
		if (readAnnouncements.ids.length === 0 && announcements.length > 0) {
			readAnnouncements.markManyAsRead(announcements.map((a) => a.id));
		}
	});
</script>

<Page title="Announcements" description="Stay up to date with the latest ReVanced news">
	<div class="search-section">
		<div class="search-inner">
			<div class="search-row">
				<Search
					bind:value={searchTerm}
					placeholder="Search for announcements"
					onkeyup={debouncedUpdate}
					onclear={() => {
						displayedTerm = '';
						syncUrlWithSearch();
					}}
				/>
			</div>
		</div>
	</div>

	<main class="wrapper" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
		{#if allTags.length > 0}
			<TagsFilter
				tags={allTags}
				{selectedTags}
				onTagClick={onTagSelect}
			/>
		{/if}

		{#if filteredActive.length > 0}
			<div class="cards">
				{#key filteredActive.length}
					{#each filteredActive as item (item.id)}
						<div in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
							<AnnouncementCard announcement={item} />
						</div>
					{/each}
				{/key}
			</div>
		{:else if announcementsQuery.error && announcements.length === 0}
			<p class="empty-state">Failed to load announcements. Please try again later.</p>
		{:else if isLoading}
			<p class="empty-state">Loading announcements...</p>
		{/if}

		{#if filteredArchived.length > 0}
			<button
				type="button"
				class="expand-archived"
				aria-expanded={archiveExpanded}
				onclick={toggleArchive}
			>
				<h4>Archive</h4>
				<div class="arrow" class:expanded={archiveExpanded} style="color: var(--surface-six);">
					<IconChevron />
				</div>
			</button>

			{#if archiveExpanded}
				<div
					class="cards"
					in:slide={{ easing: quintIn, duration: 250 }}
					out:slide={{ easing: quintOut, duration: 250 }}
				>
					{#key filteredArchived.length}
						{#each filteredArchived as item (item.id)}
							<AnnouncementCard announcement={item} />
						{/each}
					{/key}
				</div>
			{/if}
		{/if}
	</main>
</Page>

<style>
	.search-section {
		padding-top: 0.6rem;
		padding-bottom: 1.25rem;
		background-color: var(--surface-eight);
	}

	.search-inner {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-inline: auto;
		width: min(90%, 80rem);
	}

	.search-row {
		display: flex;
		flex: 1;
		gap: 1rem;
	}

	.search-row :global(.search-container) {
		flex: 1;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: min(90%, 80rem);
		margin-inline: auto;
		padding-bottom: 3rem;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		width: 100%;
		gap: 16px;
	}

	.empty-state {
		text-align: center;
		color: var(--text-four);
		padding: 3rem 1rem;
	}

	.expand-archived {
		display: flex;
		align-items: center;
		justify-content: space-between;
		cursor: pointer;
		user-select: none;
		padding-inline: 0.25rem;
		background: none;
		border: none;
		width: 100%;
	}

	.expand-archived h4 {
		margin: 0;
		color: var(--secondary);
	}

	.arrow {
		height: 1.5rem;
		transition: all 0.2s var(--bezier-one);
		color: var(--surface-six);
		transform: rotate(0deg);
	}

	.arrow.expanded {
		transform: rotate(180deg);
	}

	.arrow :global(svg) {
		width: 24px;
		height: 24px;
	}

	@media (max-width: 768px) {
		.cards {
			display: flex;
			flex-direction: column;
		}
	}
</style>
