<script lang="ts">
	export let isEditing: boolean,
		isCreating: boolean,
		isPreviewing: boolean,
		content: string,
		contentElement: string;
</script>

{#if (isEditing || isCreating) && !isPreviewing}
	<textarea
		bind:value={contentElement}
		class:empty={!content?.trim()}
		placeholder="Enter content"
	/>
{:else if isPreviewing ? contentElement : content}
	<div>
		{@html isPreviewing ? contentElement : content}
	</div>
{/if}

<style lang="scss">
	textarea {
		&,
		&:focus {
			border: none;
			outline: none;
			border-radius: 0;
		}

		padding: 0;
		font-size: 1rem;
		letter-spacing: 0.02rem;
	}

	div {
		color: var(--text-four);
		white-space: pre-wrap;

		:global(a) {
			color: var(--primary);
			font-weight: 600;
			font-size: 0.95rem;
			text-decoration: none;

			&:hover {
				text-decoration: underline var(--secondary);
				color: var(--text-one);
			}
		}

		:global(h2),
		:global(h3),
		:global(h4),
		:global(h5),
		:global(h6) {
			color: var(--secondary);
			margin-top: 1.25rem;
			margin-bottom: 1.25rem;
		}

		:global(li) {
			list-style-position: inside;
			font-size: 0.9rem;
			font-weight: 500;
		}
	}
</style>
