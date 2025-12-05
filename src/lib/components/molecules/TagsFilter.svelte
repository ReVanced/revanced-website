<script lang="ts">
	import TagChip from '$components/atoms/TagChip.svelte';
	import Button from '$components/atoms/Button.svelte';
	import IconChevronDown from 'virtual:icons/material-symbols/keyboard-arrow-down';

	type Props = {
		tags: string[];
		selectedTags?: string[];
		expandable?: boolean;
		clickable?: boolean;
		onTagClick?: (tag: string) => void;
	};

	let {
		tags,
		selectedTags = [],
		expandable = false,
		clickable = true,
		onTagClick
	}: Props = $props();

	let showAllTags = $state(false);

	$effect(() => {
		showAllTags = !expandable;
	});

	let displayedTags = $derived.by(() => {
		if (showAllTags) return tags;
		if (selectedTags.length > 0) {
			const firstTag = tags[0];
			return [firstTag, ...selectedTags.filter((t) => t !== firstTag)].filter(Boolean) as string[];
		}
		return tags.length > 0 ? [tags[0]].filter(Boolean) as string[] : [];
	});

	function handleTagClick(tag: string) {
		onTagClick?.(tag);
	}

	function toggleExpand() {
		showAllTags = !showAllTags;
	}
</script>

<div class="tags-container">
	{#each displayedTags as tag}
		<TagChip
			{tag}
			selected={selectedTags.includes(tag)}
			{clickable}
			onclick={() => handleTagClick(tag)}
		/>
	{/each}

	{#if expandable && tags.length > 1}
		<Button buttonStyle="text" onclick={toggleExpand}>
			<span class="expand-arrow" class:expanded={showAllTags}>
				<IconChevronDown />
			</span>
		</Button>
	{/if}
</div>

<style>
	.tags-container {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		white-space: nowrap;
		gap: 4px;
	}

	.expand-arrow {
		display: inline-flex;
		transition: transform 0.2s var(--bezier-one);
		transform: rotate(-90deg);
		color: var(--surface-six);
	}

	.expand-arrow.expanded {
		transform: rotate(90deg);
	}

	.expand-arrow :global(svg) {
		width: 24px;
		height: 24px;
	}
</style>
