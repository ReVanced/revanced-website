<script lang="ts">
	import TagChip from './TagChip.svelte';
	import { derived } from 'svelte/store';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { Tags } from '$lib/types';
	import Button from '$lib/components/Button.svelte';
	import ChevronDown from 'svelte-material-icons/ChevronDown.svelte';

	export let tags: Tags;
	export let expandable: boolean = false;
	export let clickable: boolean = true;

	let showAllTags = expandable ? false : true;

	const searchParams = derived(page, ($page) => $page.url.searchParams);

	$: selectedTags = $searchParams.getAll('tag');

	$: displayedTags = (() => {
		if (showAllTags) return tags.map((tag) => tag.name);
		if (selectedTags.length > 0) {
			return [tags[0]?.name, ...selectedTags.filter((tag) => tag !== tags[0]?.name)];
		}
		return tags.length > 0 ? [tags[0]?.name] : [];
	})();

	const handleClick = (tag: string) => {
		const url = new URL(window.location.href);
		const params = new URLSearchParams(url.search);

		if (params.getAll('tag').includes(tag)) params.delete('tag', tag);
		else params.append('tag', tag);

		url.search = params.toString();
		goto(url.pathname + url.search);

		window.scrollTo({ top: 0, behavior: 'smooth' });
	};
</script>

<div>
	{#each displayedTags as tag}
		<TagChip
			{tag}
			selected={$searchParams.getAll('tag').includes(tag)}
			onClick={() => handleClick(tag)}
			{clickable}
		/>
	{/each}

	{#if expandable && tags.length > 1}
		<li class="button">
			<Button type="text" on:click={() => (showAllTags = !showAllTags)}>
				<div
					class="expand-arrow"
					style:transform={showAllTags ? 'rotate(90deg)' : 'rotate(-90deg)'}
				>
					<ChevronDown size="24px" color="var(--surface-six)" />
				</div>
			</Button>
		</li>
	{/if}
</div>

<style lang="scss">
	div {
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
