<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import TagChip from '../TagChip.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { queries } from '$data/api';
	import Query from '$lib/components/Query.svelte';

	export let isEditing, isCreating, isPreviewing, tagsElement: string[];

	$: query = createQuery(queries.announcementTags());
	$: tags = $query.data?.tags || [];

	let newTag: string | null;

	function handleNewTag() {
		if (newTag) {
			if (!tags.includes({ name: newTag })) {
				tags = [...tags, { name: newTag }];
			} else {
				tagsElement = [...tagsElement, newTag];
			}
		}
		newTag = null;
	}
</script>

{#if (isEditing || isCreating) && !isPreviewing}
	<Query {query}>
		<div>
			{#each tags as tag}
				<TagChip
					tag={tag.name}
					selected={tagsElement.includes(tag.name)}
					onClick={() => {
						if (tagsElement.includes(tag.name)) {
							tagsElement = tagsElement.filter((t) => t !== tag.name);
						} else {
							tagsElement = [...tagsElement, tag.name];
						}
					}}
				/>
			{/each}
			<div class="new-tag">
				<input
					bind:value={newTag}
					class:empty={!newTag}
					on:blur={handleNewTag}
					on:keydown={(event) => event.key === 'Enter' && handleNewTag()}
				/>
				<span>
					<Button type="icon" icon="create" />
				</span>
			</div>
		</div>
	</Query>
{/if}

<style lang="scss">
	div {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 4px;
	}
	.new-tag {
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
		display: flex;
		justify-content: center;
		align-items: center;

		gap: 8px;
		height: 32px;
		padding: 0 16px;

		border-radius: 8px;
		border: none;

		background-color: var(--tertiary);
		color: var(--text-four);

		letter-spacing: 0.02rem;
		font-size: 0.85rem;

		user-select: none;
		transition: all 0.2s var(--bezier-one);

		&.clickable {
			background-color: transparent;
			border: 1px solid var(--border);

			&.selected {
				border-color: transparent;
				background-color: var(--tertiary);
				color: var(--primary);

				.icon {
					display: inherit;
					margin-left: -6px;
					transition: none;
				}
			}

			&:hover {
				background-color: var(--surface-three);
			}
		}
	}
</style>
