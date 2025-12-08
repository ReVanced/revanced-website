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

	let showAllTags = $state(true);

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
		<li>
			<Button buttonStyle="text" onclick={toggleExpand}>
				<div class="expand-arrow" class:expanded={showAllTags}>
					<IconChevronDown />
				</div>
			</Button>
		</li>
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

	li {
		display: flex;
		align-items: center;
	}

	.expand-arrow {
		transition: all 0.2s var(--bezier-one);
		user-select: none;
		height: 1.5rem;
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
