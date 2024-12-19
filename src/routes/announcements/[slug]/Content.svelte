<script lang="ts">
	export let isEditing: boolean = false;
	export let isCreating: boolean = false;
	export let isPreviewing: boolean = false;
	export let content: string | undefined;
	export let contentInput: string | undefined = undefined;
	export let clamp: boolean = false;

	$: displayContent = isPreviewing ? contentInput : content;
</script>

{#if (isEditing || isCreating) && !isPreviewing}
	<textarea bind:value={contentInput} class:empty={!content?.trim()} placeholder="Enter content" />
{:else if displayContent}
	<div class:clamp>
		{@html displayContent}
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

		&.clamp {
			display: -webkit-inline-box;
			line-clamp: 3;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
			overflow: hidden;

			:global(a) {
				pointer-events: none;
			}

			:global(h1),
			:global(h2),
			:global(h3),
			:global(h4),
			:global(h5),
			:global(h6) {
				color: var(--secondary);
				line-height: 1.75rem;
				margin: 0;
			}
		}

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

		:global(h1) {
			font-size: 1.8rem;
		}

		:global(h2) {
			font-size: 1.6rem;
		}

		:global(h3) {
			font-size: 1.4rem;
		}

		:global(h4) {
			font-size: 1.2rem;
		}

		:global(h5) {
			font-size: 1.1rem;
		}

		:global(h6) {
			font-size: 1rem;
		}

		:global(li) {
			list-style-position: inside;
			font-size: 0.9rem;
			font-weight: 500;
		}
	}
</style>
