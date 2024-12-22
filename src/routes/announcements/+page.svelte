<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { derived, readable, type Readable } from 'svelte/store';
	import { building } from '$app/environment';
	import { page } from '$app/stores';
	import Footer from '$layout/Footer/FooterHost.svelte';
	import { fly, slide } from 'svelte/transition';
	import { quintIn, quintOut } from 'svelte/easing';

	import Query from '$lib/components/Query.svelte';
	import AnnouncementCard from './AnnouncementCard.svelte';
	import { queries } from '$data/api';
	import TagsHost from './TagsHost.svelte';
	import Search from '$lib/components/Search.svelte';
	import { onMount } from 'svelte';
	import type { ResponseAnnouncement } from '$lib/types';
	import { admin_login } from '$lib/stores';
	import Button from '$lib/components/Button.svelte';
	import moment from 'moment';
	import { debounce } from '$util/debounce';
	import createFilter from '$util/filter';

	import ChevronDown from 'svelte-material-icons/ChevronDown.svelte';
	import Create from 'svelte-material-icons/Plus.svelte';

	let searchParams: Readable<URLSearchParams>;

	if (building) searchParams = readable(new URLSearchParams());
	else searchParams = derived(page, ($page) => $page.url.searchParams);

	let searchTerm = $searchParams.get('s') || '';

	$: query = createQuery(queries.announcements());
	$: tagsQuery = createQuery(queries.announcementTags());
	$: selectedTags = $searchParams.getAll('tag');

	let expanded = false;

	function filterAnnouncements(
		announcements: Iterable<ResponseAnnouncement>,
		search: string,
		selectedTags: string[]
	): ResponseAnnouncement[] {
		const announcementFilter = createFilter(Array.from(announcements), {
			searcherOptions: {
				keys: ['title', 'content']
			},
			additionalFilter: (announcement: ResponseAnnouncement, tags: string[]): boolean => {
				return (
					tags.length === 0 ||
					tags.some((tag) => announcement.tags && announcement.tags.includes(tag))
				);
			}
		});

		return announcementFilter(selectedTags, search);
	}

	// Make sure we don't have to filter the announcements after every key press
	let displayedTerm = '';
	const update = () => {
		displayedTerm = searchTerm;

		const url = new URL(window.location.href);
		url.pathname = '/announcements';

		if (searchTerm) url.searchParams.set('s', searchTerm);
		else url.searchParams.delete('s');
	};

	onMount(update);
</script>

<div class="search">
	<div class="search-contain">
		<!-- Must bind both variables: we get searchTerm from the text input, -->
		<div class="search-bar">
			<Search
				bind:searchTerm
				bind:displayedTerm
				title="Search for announcements"
				on:keyup={debounce(update)}
			/>
		</div>
		{#if $admin_login.logged_in}
			<Button type="filled" icon={Create} href="/announcements/create">Create</Button>
		{/if}
	</div>
</div>
<main class="wrapper" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	<Query query={tagsQuery} let:data>
		<TagsHost tags={data.tags} />
	</Query>

	<Query {query} let:data>
		<div class="cards">
			{#each filterAnnouncements(data.announcements, displayedTerm, selectedTags) as announcement}
				{#if !announcement.archived_at || moment(announcement.archived_at).isAfter(moment())}
					{#key selectedTags || displayedTerm}
						<div in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
							<AnnouncementCard {announcement} />
						</div>
					{/key}
				{/if}
			{/each}
		</div>

		<div
			role="button"
			class="expand-archived"
			aria-expanded={expanded}
			class:closed={!expanded}
			on:click={() => (expanded = !expanded)}
			on:keypress={() => (expanded = !expanded)}
			tabindex="0"
		>
			<h4>Archived announcements</h4>

			<div id="arrow" style:transform={expanded ? 'rotate(0deg)' : 'rotate(-180deg)'}>
				<ChevronDown size="24px" color="var(--surface-six)" />
			</div>
		</div>

		{#if expanded}
			<div
				class="cards"
				in:slide={{ easing: quintIn, duration: 250 }}
				out:slide={{ easing: quintOut, duration: 250 }}
			>
				{#each filterAnnouncements(data.announcements, displayedTerm, selectedTags) as announcement}
					{#if announcement.archived_at && moment(announcement.archived_at).isBefore(moment())}
						{#key selectedTags || displayedTerm}
							<AnnouncementCard {announcement} />
						{/key}
					{/if}
				{/each}
			</div>
		{/if}
	</Query>
</main>
<Footer />

<style lang="scss">
	.expand-archived {
		display: flex;
		align-items: center;
		justify-content: space-between;
		cursor: pointer;
		user-select: none;
		padding: 0rem 0.25rem;

		#arrow {
			height: 1.5rem;
			transition: all 0.2s var(--bezier-one);
		}
	}

	.search {
		padding-top: 5rem;
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

	main {
		margin-top: 2rem;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		padding: 16px 0;
		min-width: 0;
		width: 100%;
		gap: 16px;
	}

	@media (max-width: 767px) {
		.cards {
			display: flex;
			flex-direction: column;
		}
	}
</style>
