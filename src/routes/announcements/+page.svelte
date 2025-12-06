<script lang="ts">
	import { slide } from 'svelte/transition';
	import { quintIn, quintOut } from 'svelte/easing';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Page from '$components/molecules/Page.svelte';
	import Search from '$components/atoms/Search.svelte';
	import TagsFilter from '$components/molecules/TagsFilter.svelte';
	import AnnouncementCard from '$components/molecules/AnnouncementCard.svelte';
	import Button from '$components/atoms/Button.svelte';
	import IconChevron from 'virtual:icons/material-symbols/keyboard-arrow-down';
	import IconAdd from 'virtual:icons/material-symbols/add';
	import { announcementsQuery, readAnnouncements, auth } from '$stores';
	import type { Announcement } from '$api';

	let searchTerm = $state('');
	let selectedTags = $state<string[]>([]);
	let archiveExpanded = $state(false);

	$effect(() => {
		if (!browser) return;
		
		const params = $page.url.searchParams;
		const urlSearch = params.get('s') ?? '';
		const urlTags = params.get('tags')?.split(',').filter(Boolean) ?? [];
		
		if (urlSearch !== searchTerm) {
			searchTerm = urlSearch;
		}
		if (JSON.stringify(urlTags) !== JSON.stringify(selectedTags)) {
			selectedTags = urlTags;
		}
	});

	let isInitialSync = $state(true);
	
	$effect(() => {
		if (!browser) return;
		
		if (isInitialSync) {
			isInitialSync = false;
			return;
		}
		
		const params = new URLSearchParams();
		
		if (searchTerm.trim()) {
			params.set('s', searchTerm.trim());
		}
		if (selectedTags.length > 0) {
			params.set('tags', selectedTags.join(','));
		}
		
		const queryString = params.toString();
		const newUrl = queryString ? `?${queryString}` : window.location.pathname;
		
		goto(newUrl, { replaceState: true, noScroll: true, keepFocus: true });
	});

	let announcements = $derived(announcementsQuery.data ?? []);

	let allTags = $derived.by(() => {
		const tagSet = new Set<string>();
		for (const item of announcements) {
			if (item.tags) {
				for (const tag of item.tags) {
					tagSet.add(tag);
				}
			}
		}
		return Array.from(tagSet).sort();
	});

	function isArchivedNow(archivedAt: string | null): boolean {
		if (!archivedAt) return false;
		return new Date(archivedAt) < new Date();
	}

	let activeItems = $derived(
		announcements.filter((item: Announcement) => !isArchivedNow(item.archived_at))
	);

	let archivedItems = $derived(
		announcements.filter((item: Announcement) => isArchivedNow(item.archived_at))
	);

	function applyFilters(items: Announcement[]) {
		let result = items;

		if (searchTerm.trim()) {
			const query = searchTerm.toLowerCase();
			result = result.filter(
				(item: Announcement) =>
					item.title.toLowerCase().includes(query) ||
					(item.content?.toLowerCase().includes(query) ?? false)
			);
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

	let hasFilters = $derived(searchTerm.trim() !== '' || selectedTags.length > 0);

	let isLoading = $derived(announcementsQuery.loading);

	let unreadCount = $derived.by(() => {
		const activeIds = activeItems.map((a) => a.id);
		return readAnnouncements.countUnread(activeIds);
	});

	function onTagSelect(tag: string) {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter((t) => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
	}

	function toggleArchive() {
		archiveExpanded = !archiveExpanded;
	}

	function markAllAsRead() {
		const allIds = announcements.map((a) => a.id);
		readAnnouncements.markManyAsRead(allIds);
	}

	let isAdmin = $derived(auth.isLoggedIn);
</script>

<Page title="Announcements" description="Stay up to date with the latest ReVanced news">
	<div class="search-section">
		<div class="search-inner">
			<div class="search-row">
				<Search
					bind:value={searchTerm}
					placeholder="Search for announcements"
				/>
				{#if isAdmin}
					<Button buttonStyle="filled" href="/announcements/create">
						<IconAdd />
						Create
					</Button>
				{/if}
			</div>
			{#if unreadCount > 0}
				<div class="unread-notice">
					<span class="unread-badge">{unreadCount}</span>
					<span>unread announcement{unreadCount !== 1 ? 's' : ''}</span>
					<button type="button" class="mark-read-btn" onclick={markAllAsRead}>
						Mark all as read
					</button>
				</div>
			{/if}
		</div>
	</div>

	<main class="main-content">
		{#if allTags.length > 0}
			<TagsFilter
				tags={allTags}
				{selectedTags}
				onTagClick={onTagSelect}
			/>
		{/if}

		{#if filteredActive.length > 0}
			<div class="cards-grid">
				{#each filteredActive as item (item.id)}
					<AnnouncementCard announcement={item} />
				{/each}
			</div>
		{:else if isLoading}
			<p class="empty-state">Loading announcements...</p>
		{:else if hasFilters && filteredActive.length === 0 && filteredArchived.length === 0}
			<p class="empty-state">No announcements match your search.</p>
		{/if}

		{#if filteredArchived.length > 0}
			<button type="button" class="archive-toggle" onclick={toggleArchive}>
				<h4>Archive</h4>
				<span class="archive-arrow" class:open={archiveExpanded}>
					<IconChevron />
				</span>
			</button>

			{#if archiveExpanded}
				<div
					class="cards-grid"
					in:slide={{ easing: quintIn, duration: 250 }}
					out:slide={{ easing: quintOut, duration: 250 }}
				>
					{#each filteredArchived as item (item.id)}
						<AnnouncementCard announcement={item} />
					{/each}
				</div>
			{/if}
		{/if}
	</main>
</Page>

<style>
	.search-section {
		background-color: var(--surface-eight);
		padding: 0.6rem 0 1.25rem;
	}

	.search-inner {
		width: min(90%, 80rem);
		margin-inline: auto;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.search-row {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.search-row :global(.search-wrapper) {
		flex: 1;
	}

	.unread-notice {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--text-four);
	}

	.unread-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 1.5rem;
		height: 1.5rem;
		padding: 0 0.4rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--surface-one);
		background-color: var(--primary);
		border-radius: 999px;
	}

	.mark-read-btn {
		margin-left: auto;
		padding: 0.35rem 0.75rem;
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--primary);
		background: none;
		border: 1px solid var(--primary);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.mark-read-btn:hover {
		background-color: var(--primary);
		color: var(--surface-one);
	}

	.main-content {
		width: min(90%, 80rem);
		margin-inline: auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding-top: 1.7rem;
		padding-bottom: 3rem;
	}

	.cards-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	.empty-state {
		text-align: center;
		color: var(--text-four);
		padding: 3rem 1rem;
	}

	.archive-toggle {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 0.5rem 0.25rem;
		background: none;
		border: none;
		cursor: pointer;
		user-select: none;
	}

	.archive-toggle h4 {
		margin: 0;
		color: var(--text-one);
	}

	.archive-arrow {
		display: flex;
		align-items: center;
		color: var(--surface-six);
		transition: transform 0.2s var(--bezier-one);
	}

	.archive-arrow.open {
		transform: rotate(180deg);
	}

	.archive-arrow :global(svg) {
		width: 24px;
		height: 24px;
	}

	@media (max-width: 1024px) {
		.cards-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.cards-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
