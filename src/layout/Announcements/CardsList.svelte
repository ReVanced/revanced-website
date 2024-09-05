<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { derived, readable, type Readable } from 'svelte/store';
	import { building } from '$app/environment';
	import { page } from '$app/stores';

	import Query from '$lib/components/Query.svelte';
	import AnnouncementCard from './AnnouncementCard.svelte';
	import { queries } from '$data/api';
	import ChannelChip from './ChannelChip.svelte';

	let searchParams: Readable<URLSearchParams>;

	if (building) searchParams = readable(new URLSearchParams());
	else searchParams = derived(page, ($page) => $page.url.searchParams);

	$: query = createQuery(queries.announcements());
	$: channel = $searchParams.get('channel');

	function uniqueObjArrayByKey<T extends object>(array: T[], key: keyof T) {
		return array.filter((obj, index, self) => index === self.findIndex((t) => t[key] === obj[key]));
	}
</script>

<div class="announcements-list">
	<Query {query} let:data>
		<div class="channels-selection">
			{#each uniqueObjArrayByKey(data.announcements, 'channel') as ann (ann.id)}
				<ChannelChip channel={ann.channel} />
			{/each}
		</div>

		{#each channel ? data.announcements.filter((a) => a.channel === channel) : data.announcements as ann (ann.id)}
			<AnnouncementCard title={ann.title} author={ann.author} created_at={ann.createdAt.value}>
				<svelte:fragment slot="channel">
					<ChannelChip channel={ann.channel} />
				</svelte:fragment>
				<svelte:fragment slot="content">
					<!-- @html since some if not most announcements contain HTML -->
					{@html ann.content}
				</svelte:fragment>
			</AnnouncementCard>
		{/each}
	</Query>
</div>

<style>
</style>
