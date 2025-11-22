<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import TagChip from '../TagChip.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { queries } from '$data/api';
	import Query from '$lib/components/Query.svelte';
	import Create from 'svelte-material-icons/Plus.svelte';

	let {
		isEditing,
		isCreating,
		isPreviewing,
		tagsInput = $bindable()
	}: {
		isEditing: boolean;
		isCreating: boolean;
		isPreviewing: boolean;
		tagsInput: string[] | undefined;
	} = $props();

	const query = createQuery(() => queries.announcementTags());
	let tags: { name: string }[] = $state([]);

	$effect(() => {
		if (query.data?.tags) {
			tags = query.data.tags;
		}
	});

	let newTag: string | null = $state(null);

	function handleTag(tag: string | null) {
		if (!tag) return;

		if (tags.some((t) => t.name === tag)) {
			if (tagsInput?.includes(tag)) {
				tagsInput = tagsInput.filter((t) => t !== tag);

				if (!query.data?.tags.some((t) => t.name === tag)) {
					tags = tags.filter((t) => t.name !== tag);
				}
			} else {
				tagsInput = [...(tagsInput || []), tag];
			}
		} else {
			tags = [...tags, { name: tag }];
			tagsInput = [...(tagsInput || []), tag];
		}

		newTag = null;
	}
</script>

{#if (isEditing || isCreating) && !isPreviewing}
	<Query {query}>
		{#snippet children(data)}
			<div>
				{#each tags as tag}
					<TagChip
						tag={tag.name}
						selected={tagsInput && tagsInput.includes(tag.name)}
						onClick={() => handleTag(tag.name)}
					/>
				{/each}
				<div id="new-tag">
					<input
						bind:value={newTag}
						class:empty={!newTag}
						onblur={() => handleTag(newTag)}
						onkeydown={(event) => {
							if (event.key === 'Enter') handleTag(newTag);
						}}
					/>
					<span>
						<Button icon={Create} iconColor="var(--text-four)" />
					</span>
				</div>
			</div>
		{/snippet}
	</Query>
{/if}

<style lang="scss">
	div {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 4px;
	}

	#new-tag {
		display: inline-flex;
		position: relative;

		input {
			&,
			&:focus {
				border: none;
				outline: none;
			}
			&:focus {
				width: 100%;
				+ span {
					display: none;
				}
			}

			width: 38px;
		}

		span {
			pointer-events: none;
			position: absolute;
			left: 9px;
			top: 6px;
		}
	}

	input {
		height: 32px;

		border-radius: 8px;

		background-color: var(--tertiary);
		color: var(--text-four);

		letter-spacing: 0.02rem;
		font-size: 0.85rem;

		transition: all 0.2s var(--bezier-one);
	}
</style>
