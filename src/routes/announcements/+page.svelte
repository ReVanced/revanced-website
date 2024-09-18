<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { derived, readable, type Readable } from 'svelte/store';
	import { building } from '$app/environment';
	import { page } from '$app/stores';

	import Query from '$lib/components/Query.svelte';
	import AnnouncementCard from './AnnouncementCard.svelte';
	import { queries } from '$data/api';
	import ChannelChip from './ChannelChip.svelte';
	import Masonry from '$lib/components/Masonry.svelte';

	let searchParams: Readable<URLSearchParams>;

	if (building) searchParams = readable(new URLSearchParams());
	else searchParams = derived(page, ($page) => $page.url.searchParams);

	$: query = createQuery(queries.announcements());
	$: channel = $searchParams.get('channel');

	function uniqueObjArrayByKey<T extends object>(array: T[], key: keyof T) {
		return array.filter((obj, index, self) => index === self.findIndex((t) => t[key] === obj[key]));
	}
</script>

<main class="wrapper">
	<div class="announcements-list">
		<Query {query} let:data>
			<div class="channels-selection">
				{#each uniqueObjArrayByKey(data.announcements, 'channel') as ann (ann.id)}
					<ChannelChip channel={ann.channel} />
				{/each}
			</div>

			<Masonry>
				{#each channel ? data.announcements.filter((a) => a.channel === channel) : data.announcements as announcement (announcement.id)}
					<AnnouncementCard {announcement} />
				{/each}
			</Masonry>
		</Query>
	</div>
</main>
