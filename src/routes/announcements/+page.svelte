<script lang="ts">
	import { browser } from '$app/environment';
	import { goto, replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import Page from '$components/templates/Page.svelte';
	import Search from '$components/atoms/Search.svelte';
	import Button from '$components/atoms/Button.svelte';
	import TagsFilter from '$components/molecules/TagsFilter.svelte';
	import AnnouncementCard from '$components/organisms/AnnouncementCard.svelte';
	import AnnouncementDetail from './AnnouncementDetail.svelte';
	import IconChevron from 'svelte-material-icons/ChevronDown.svelte';
	import IconAdd from 'svelte-material-icons/Plus.svelte';
	import { readAnnouncements, auth, announcementPolling } from '$stores';
	import { debounce, isArchived, isScheduled } from '$lib/utils';
	import { createFilter } from '$lib/utils/filter';
	import type { Announcement } from '$api';

	let { data } = $props();

	let selectedId = $derived(page.url.searchParams.get('id'));

	const initialParams = browser
		? new URL(window.location.href).searchParams
		: new URLSearchParams();
	let searchTerm = $state(initialParams.get('s') ?? '');
	let displayedTerm = $state(initialParams.get('s') ?? '');
	let selectedTags = $state<string[]>(initialParams.getAll('tag'));
	let archiveOpen = $state(false);
	let archiveContentElement = $state<HTMLElement>();
	let archiveContentHeight = $derived(archiveContentElement?.scrollHeight ?? 0);
	const announcementFilter = createFilter<Announcement, { selectedTags: string[] }>(
		{
			keys: ['title', 'content', 'tags'],
			threshold: 0.3,
			shouldSort: true
		},
		(item, { selectedTags }) => {
			if (selectedTags.length === 0) return true;
			return selectedTags.some((tag) => item.tags?.includes(tag) ?? false);
		}
	);

	$effect(() => {
		if (!browser) return;

		const urlTags = page.url.searchParams.getAll('tag');
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

		const url = new URL(page.url);
		url.pathname = '/announcements';

		if (searchTerm.trim()) {
			url.searchParams.set('s', searchTerm.trim());
		} else {
			url.searchParams.delete('s');
		}

		replaceState(url.pathname + url.search, {});
	}

	let announcements = $derived(data.announcements ?? []);

	$effect(() => {
		if ((data.announcements?.length ?? 0) > 0) {
			announcementPolling.syncData(data.announcements);
		}
	});
	let visibleAnnouncements = $derived(
		auth.isLoggedIn
			? announcements
			: announcements.filter((item: Announcement) => !isScheduled(item.created_at))
	);

	let activeItems = $derived(
		visibleAnnouncements.filter((item: Announcement) => !isArchived(item.archived_at))
	);

	let archivedItems = $derived(
		visibleAnnouncements.filter((item: Announcement) => isArchived(item.archived_at))
	);

	let activeTags = $derived(
		[...new Set(activeItems.flatMap((a: Announcement) => a.tags ?? []))]
	);

	let archivedTags = $derived(
		[...new Set(archivedItems.flatMap((a: Announcement) => a.tags ?? []))]
	);

	let filteredActive = $derived(announcementFilter(activeItems, displayedTerm, { selectedTags }));

	let selectedArchivedTags = $state<string[]>([]);

	let filteredArchived = $derived(
		announcementFilter(archivedItems, displayedTerm, { selectedTags: selectedArchivedTags })
	);

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

	function onArchivedTagSelect(tag: string) {
		if (selectedArchivedTags.includes(tag)) {
			selectedArchivedTags = selectedArchivedTags.filter((t) => t !== tag);
		} else {
			selectedArchivedTags = [...selectedArchivedTags, tag];
		}
	}

	function toggleArchive() {
		archiveOpen = !archiveOpen;
	}

	$effect(() => {
		if (!readAnnouncements.hasTrackedAnnouncements && announcements.length > 0) {
			readAnnouncements.markManyAsRead(announcements);
		}
	});
</script>

<Page title="" description="">
	{#if selectedId}
		<AnnouncementDetail id={selectedId} allAnnouncements={announcements} />
	{:else}
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
					{#if auth.isLoggedIn}
						<Button buttonStyle="filled" icon={IconAdd} href="/announcements?id=create">
							Create
						</Button>
					{/if}
				</div>
			</div>
		</div>

		<section class="wrapper">
			{#if activeTags.length > 0}
				<TagsFilter tags={activeTags} {selectedTags} onTagClick={onTagSelect} />
			{/if}

			{#if filteredActive.length > 0}
				<div class="cards">
					{#each filteredActive as item (item.id)}
						<div>
							<AnnouncementCard announcement={item} />
						</div>
					{/each}
				</div>
			{:else if announcements.length === 0}
				<p class="empty-state">No announcements available.</p>
			{/if}

			{#if filteredArchived.length > 0}
				<button
					type="button"
					class="archive-toggle"
					aria-expanded={archiveOpen}
					onclick={toggleArchive}
				>
					<h4>Archive</h4>
					<span class="archive-chevron" class:open={archiveOpen}>
						<IconChevron size={24} />
					</span>
				</button>

				<section
					bind:this={archiveContentElement}
					class="archive-content"
					class:open={archiveOpen}
					style="max-height: {archiveOpen ? `${archiveContentHeight}px` : '0px'}"
					aria-hidden={!archiveOpen}
				>
					{#if archivedTags.length > 0}
						<div class="archived-tags">
							<TagsFilter
								tags={archivedTags}
								selectedTags={selectedArchivedTags}
								onTagClick={onArchivedTagSelect}
							/>
						</div>
					{/if}
					<div class="cards">
						{#each filteredArchived as item (item.id)}
							<AnnouncementCard announcement={item} />
						{/each}
					</div>
				</section>
			{/if}
		</section>
	{/if}
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
		padding-bottom: 0.2rem;
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

	.archive-toggle {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 0.25rem;
		background: transparent;
		border: none;
		cursor: pointer;
		user-select: none;
	}

	.archive-toggle h4 {
		margin: 0;
		color: var(--secondary);
	}

	.archive-chevron {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--surface-six);
		transition: transform 0.25s var(--bezier-one);
	}

	.archive-chevron.open {
		transform: rotate(180deg);
	}

	.archive-content {
		overflow: hidden;
		transition: max-height 0.5s var(--bezier-one);
		will-change: max-height;
	}

	.archived-tags {
		padding-bottom: 1rem;
	}

	@media (max-width: 768px) {
		.cards {
			display: flex;
			flex-direction: column;
		}
	}
</style>
