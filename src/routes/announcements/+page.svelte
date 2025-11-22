<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { derived, readable, type Readable } from 'svelte/store';
	import { building } from '$app/environment';
	import { page } from '$app/stores';
	import { fly, slide } from 'svelte/transition';
	import { quintIn, quintOut } from 'svelte/easing';

	import Query from '$lib/components/Query.svelte';
	import AnnouncementCard from './AnnouncementCard.svelte';
	import { queries } from '$data/api';
	import TagsHost from './TagsHost.svelte';
	import Search from '$lib/components/Search.svelte';
	import type { ResponseAnnouncement } from '$lib/types';
	import { admin_login, read_announcements } from '$lib/stores.svelte';
	import Button from '$lib/components/Button.svelte';
	import moment from 'moment';
	import { debounce } from '$util/debounce';
	import createFilter from '$util/filter';

	import ChevronDown from 'svelte-material-icons/ChevronDown.svelte';
	import Create from 'svelte-material-icons/Plus.svelte';

	let expanded = $state(false);

	const searchParams: Readable<URLSearchParams> = building
		? readable(new URLSearchParams())
		: derived(page, ($page) => $page.url.searchParams);

	let searchTerm = $state($searchParams.get('s') || '');
	let displayedTerm = $state('');

	const query = createQuery(() => queries.announcements());
	const tagsQuery = createQuery(() => queries.announcementTags());
	const selectedTags = $derived($searchParams.getAll('tag'));

	const update = () => {
		displayedTerm = searchTerm;

		const url = new URL(window.location.href);
		url.pathname = '/announcements';

		searchTerm ? url.searchParams.set('s', searchTerm) : url.searchParams.delete('s');
	};

	const archivedAnnouncements = (announcements: ResponseAnnouncement[]) =>
		announcements.filter((a) => a.archived_at && moment(a.archived_at).isBefore(moment()));
	const activeAnnouncements = (announcements: ResponseAnnouncement[]) =>
		announcements.filter((a) => !a.archived_at || moment(a.archived_at).isAfter(moment()));

	const filterAnnouncements = (
		announcements: ResponseAnnouncement[],
		search: string,
		tags: string[]
	): ResponseAnnouncement[] => {
		const announcementFilter = createFilter(announcements, {
			searcherOptions: { keys: ['title', 'content'] },

			additionalFilter: (a: ResponseAnnouncement, tags: string[]) =>
				tags.length === 0 || tags.some((tag) => a.tags?.includes(tag))
		});

		return announcementFilter(tags, search);
	};

	$effect(() => {
		debounce(update)();

		if (read_announcements.value.size === 0 && query.data) {
			read_announcements.addAll(query.data.announcements.map((a) => a.id));
		}
	});
</script>

<div class="search">
	<div class="search-contain">
		<!-- Must bind both variables: we get searchTerm from the text input, -->
		<div class="search-bar">
			<Search
				bind:searchTerm
				bind:displayedTerm
				title="Search for announcements"
				onkeyup={debounce(update)}
			/>
		</div>
		{#if admin_login.value.logged_in}
			<Button type="filled" icon={Create} href="/announcements/create">Create</Button>
		{/if}
	</div>
</div>
<main class="wrapper" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	<Query query={tagsQuery}>
		{#snippet children(data)}
		<TagsHost tags={data.tags} />
		{/snippet}
	</Query>

	<Query {query}>
		{#snippet children(data)}
		{#if activeAnnouncements(filterAnnouncements(data.announcements, displayedTerm, selectedTags)).length}
			<div class="cards">
				{#each activeAnnouncements(filterAnnouncements(data.announcements, displayedTerm, selectedTags)) as announcement}
					<div in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
						<AnnouncementCard {announcement} />
					</div>
				{/each}
			</div>
		{/if}

		{#if archivedAnnouncements(filterAnnouncements(data.announcements, displayedTerm, selectedTags)).length}
			<div
				role="button"
				class="expand-archived"
				aria-expanded={expanded}
				onclick={() => (expanded = !expanded)}
				onkeypress={() => (expanded = !expanded)}
				tabindex="0"
			>
				<h4>Archive</h4>

				<div id="arrow" style:transform={expanded ? 'rotate(-180deg)' : 'rotate(0deg)'}>
					<ChevronDown size="24px" color="var(--surface-six)" />
				</div>
			</div>

			{#if expanded}
				<div
					class="cards"
					in:slide={{ easing: quintIn, duration: 250 }}
					out:slide={{ easing: quintOut, duration: 250 }}
				>
					{#each archivedAnnouncements(filterAnnouncements(data.announcements, displayedTerm, selectedTags)) as announcement}
						<AnnouncementCard {announcement} />
					{/each}
				</div>
			{/if}
		{/if}
		{/snippet}
	</Query>
</main>

<style lang="scss">
	main {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.expand-archived {
		display: flex;
		align-items: center;
		justify-content: space-between;
		cursor: pointer;
		user-select: none;
		padding-inline: 0.25rem;

		#arrow {
			height: 1.5rem;
			transition: all 0.2s var(--bezier-one);
		}
	}

	.search {
		padding-top: 0.6rem;
		padding-bottom: 1.25rem;
		background-color: var(--surface-eight);

		.search-contain {
			display: flex;
			justify-content: center;
			gap: 1rem;
			margin-inline: auto;
			width: min(90%, 80rem);

			.search-bar {
				flex: 1;
			}
		}
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		width: 100%;
		gap: 16px;

		@media (max-width: 768px) {
			display: flex;
			flex-direction: column;
		}
	}
</style>
