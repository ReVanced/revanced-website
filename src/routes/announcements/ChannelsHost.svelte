<script>
	// @ts-nocheck
	import ChannelChip from './ChannelChip.svelte';
	import Button from '$lib/components/Button.svelte';
	import { goto } from '$app/navigation';
	import { derived, readable } from 'svelte/store';
	import { building } from '$app/environment';
	import { page } from '$app/stores';

	export let announcements;

	function sortChannelsByAnnouncements(announcements) {
		const channelAnnouncementCounts = announcements.reduce((channelCountMap, announcement) => {
			const channelName = announcement.channel;
			channelCountMap[channelName] = (channelCountMap[channelName] || 0) + 1;
			return channelCountMap;
		}, {});

		const sortedChannels = Object.entries(channelAnnouncementCounts)
			.sort(([channelA, countA], [channelB, countB]) => countB - countA)
			.map(([channelName]) => channelName);

		return sortedChannels;
	}

	const sortedChannels = sortChannelsByAnnouncements(announcements);
	let showAllChannels = false;

	let searchParams;

	if (building) searchParams = readable(new URLSearchParams());
	else searchParams = derived(page, ($page) => $page.url.searchParams);

	$: selectedChannels = $searchParams.getAll('channel');
</script>

<div class="channel-list">
	{#if showAllChannels}
		{#each sortedChannels as channel}
			<ChannelChip {channel} />
		{/each}
	{:else if selectedChannels.length > 0}
		<ChannelChip channel={sortedChannels[0]} />
		{#each selectedChannels.filter((channel) => channel !== sortedChannels[0]) as channel}
			<ChannelChip {channel} />
		{/each}
	{:else}
		<ChannelChip channel={sortedChannels[0]} />
	{/if}

	{#if sortedChannels.length > 1}
		<li class="button">
			<Button type="text" on:click={() => (showAllChannels = !showAllChannels)}>
				<img
					class="expand-arrow"
					style:transform={showAllChannels ? 'rotate(90deg)' : 'rotate(-90deg)'}
					src="/icons/expand_more.svg"
					alt="dropdown"
				/>
			</Button>
		</li>
	{/if}
</div>

<style lang="scss">
	.channel-list {
		display: flex;
		align-items: center;
		gap: 4px;

		.button {
			display: flex;
			align-items: center;
		}

		.expand-arrow {
			transition: all 0.2s var(--bezier-one);
			user-select: none;
			height: 1.5rem;
		}

		.rotate .expand-arrow {
			transform: rotate(180deg);
		}
	}
</style>
