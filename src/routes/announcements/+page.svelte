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
	import ChannelsHost from './ChannelsHost.svelte';

	let searchParams: Readable<URLSearchParams>;

	if (building) searchParams = readable(new URLSearchParams());
	else searchParams = derived(page, ($page) => $page.url.searchParams);

	$: query = createQuery(queries.announcements());
	$: channels = $searchParams.getAll('channel');
</script>

<main class="wrapper" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	<div class="announcements-list">
		<Query {query} let:data>
			<ChannelsHost announcements={data.announcements.values()} />

			<div class="cards">
				{#each channels.length > 0 ? data.announcements
							.values()
							.filter( (a) => channels.includes(a.channel) ) : data.announcements.values() as announcement (announcement.id)}
					<AnnouncementCard {announcement} />
				{/each}
			</div>
		</Query>
	</div>
</main>
<Footer />

<style>
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
