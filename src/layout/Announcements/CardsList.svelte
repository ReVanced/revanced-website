<script>
	import { createQuery } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';

	import Query from '$lib/components/Query.svelte';
	import AnnouncementCard from './AnnouncementCard.svelte';
	import { queries } from '$data/api';
	import ChannelChip from './ChannelChip.svelte';

	$: query = createQuery(queries.announcements());

	// onMount(() => {
	// 	const channel = new URLSearchParams(window.location.search).get('channel');
	// 	if (channel) query = createQuery(queries.announcements(channel));
	// });
</script>

<div class="announcements-list">
	<Query {query} let:data>
		{#each data.announcements as ann (ann.id)}
			<AnnouncementCard title={ann.title} author={ann.author} created_at={ann.createdAt.value}>
				<svelte:fragment slot="channel">
					<ChannelChip channel={ann.channel} />
				</svelte:fragment>
			</AnnouncementCard>
		{/each}
	</Query>
</div>

<style>
</style>
