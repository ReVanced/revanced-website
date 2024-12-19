<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { derived, readable, type Readable } from 'svelte/store';
	import { building } from '$app/environment';
	import { page } from '$app/stores';
	import Footer from '$layout/Footer/FooterHost.svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

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

	let searchParams: Readable<URLSearchParams>;

	if (building) searchParams = readable(new URLSearchParams());
	else searchParams = derived(page, ($page) => $page.url.searchParams);

	let searchTerm = $searchParams.get('s') || '';

	$: query = createQuery(queries.announcements());
	$: tagsQuery = createQuery(queries.announcementTags());
	$: selectedTags = $searchParams.getAll('tag');

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
			<Button type="filled" href="/announcements/create">
				<svg height="24px" viewBox="0 -960 960 960" fill="#141d3a">
					<path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
				</svg>
				Create
			</Button>
		{/if}
	</div>
</div>
<main class="wrapper" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	<div class="announcements-list">
		<Query query={tagsQuery} let:data>
			<TagsHost tags={data.tags} />
		</Query>

		<Query {query} let:data>
			<div class="cards">
				{#each filterAnnouncements(data.announcements, displayedTerm, selectedTags) as announcement}
					{#if !moment(announcement.archived_at).isBefore(moment()) || $admin_login.logged_in}
						{#key selectedTags || displayedTerm}
							<div in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
								<AnnouncementCard {announcement} />
							</div>
						{/key}
					{/if}
				{/each}
			</div>
		</Query>
	</div>
</main>
<Footer />

<style lang="scss">
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
		padding: 16px 0px;
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
