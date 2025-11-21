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
	<textarea bind:value={contentInput} class:empty={!content?.trim()} placeholder="Enter content"></textarea>
{:else if displayContent}
	<div class:clamp>
		{@html displayContent}
	</div>
{/if}

<style>
	textarea,
	textarea:focus {
		border: none;
		outline: none;
		border-radius: 0;
	}

	textarea {
		padding: 0;
		font-size: 1rem;
		letter-spacing: 0.02rem;
	}

	div {
		color: var(--text-four);
	}

	div.clamp {
		display: -webkit-inline-box;
		line-clamp: 3;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	div.clamp :global(a) {
		pointer-events: none;
	}

	div.clamp :global(h1),
	div.clamp :global(h2),
	div.clamp :global(h3),
	div.clamp :global(h4),
	div.clamp :global(h5),
	div.clamp :global(h6) {
		color: var(--secondary);
		line-height: 1.75rem;
		margin: 0;
	}

	div :global(a) {
		color: var(--primary);
		font-weight: 600;
		font-size: 0.95rem;
		text-decoration: none;
	}

	div :global(a):hover {
		text-decoration: underline var(--secondary);
		color: var(--text-one);
	}

	div :global(h2),
	div :global(h3),
	div :global(h4),
	div :global(h5),
	div :global(h6) {
		color: var(--secondary);
		margin-top: 1.25rem;
		margin-bottom: 1.25rem;
	}

	div :global(h1) {
		font-size: 1.8rem;
	}

	div :global(h2) {
		font-size: 1.6rem;
	}

	div :global(h3) {
		font-size: 1.4rem;
	}

	div :global(h4) {
		font-size: 1.2rem;
	}

	div :global(h5) {
		font-size: 1.1rem;
	}

	div :global(h6) {
		font-size: 1rem;
	}

	div :global(li) {
		list-style-position: inside;
		font-size: 0.9rem;
		font-weight: 500;
	}
</style>
