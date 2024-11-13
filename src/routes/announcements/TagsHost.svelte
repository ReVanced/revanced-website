<script lang="ts">
	import TagChip from './TagChip.svelte';
	import Button from '$lib/components/Button.svelte';
	import { derived, readable } from 'svelte/store';
	import { building } from '$app/environment';
	import { page } from '$app/stores';
	import type { ResponseAnnouncement } from '$lib/types';
	import type { Readable } from 'svelte/store';

	export let announcements: ResponseAnnouncement[];

	function sortTagsByAnnouncements(announcements: ResponseAnnouncement[]) {
		const tagCounts: { [key: string]: number } = {};

		for (const announcement of announcements)
			for (const tag of announcement.tags) tagCounts[tag] = (tagCounts[tag] || 0) + 1;

		return Object.keys(tagCounts).sort((a, b) => {
			if (tagCounts[b] === tagCounts[a]) return a.localeCompare(b);
			return tagCounts[b] - tagCounts[a];
		});
	}

	const sortedTags = sortTagsByAnnouncements(announcements);
	let showAllTags = false;

	let searchParams: Readable<URLSearchParams>;

	if (building) searchParams = readable(new URLSearchParams());
	else searchParams = derived(page, ($page) => $page.url.searchParams);

	$: selectedTags = $searchParams.getAll('tag');
</script>

<div class="tag-list">
	{#if showAllTags}
		{#each sortedTags as tag}
			<TagChip {tag} />
		{/each}
	{:else if selectedTags.length > 0}
		<TagChip tag={sortedTags[0]} />
		{#each selectedTags.filter((tag) => tag !== sortedTags[0]) as tag}
			<TagChip {tag} />
		{/each}
	{:else}
		<TagChip tag={sortedTags[0]} />
	{/if}

	{#if sortedTags.length > 1}
		<li class="button">
			<Button type="text" on:click={() => (showAllTags = !showAllTags)}>
				<img
					class="expand-arrow"
					style:transform={showAllTags ? 'rotate(90deg)' : 'rotate(-90deg)'}
					src="/icons/expand_more.svg"
					alt="dropdown"
				/>
			</Button>
		</li>
	{/if}
</div>

<style lang="scss">
	.tag-list {
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
