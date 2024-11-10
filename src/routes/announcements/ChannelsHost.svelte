<script lang="ts">
	import ChannelChip from './ChannelChip.svelte';
	import Button from '$lib/components/Button.svelte';
	import { derived, readable } from 'svelte/store';
	import { building } from '$app/environment';
	import { page } from '$app/stores';
	import type { Announcement } from '$lib/types';
	import type { Readable } from 'svelte/store';

	export let announcements: Announcement[];

	function sortTagsByAnnouncements(announcements: Announcement[]) {
		const tagCounts: { [key: string]: number } = {};

		for (const announcement of announcements)
			for (const tag of announcement.tags) tagCounts[tag] = (tagCounts[tag] || 0) + 1;

		return Object.keys(tagCounts).sort((a, b) => {
			if (tagCounts[b] === tagCounts[a]) return a.localeCompare(b);
			return tagCounts[b] - tagCounts[a];
		});
	}

	const sortedChannels = sortTagsByAnnouncements(announcements);
	let showAllChannels = false;

	let searchParams: Readable<URLSearchParams>;

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
