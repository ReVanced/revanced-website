<script lang="ts">
	type Props = {
		isEditing: boolean;
		isPreviewing: boolean;
		content: string | null;
		contentInput: string;
	};

	let {
		isEditing,
		isPreviewing,
		content,
		contentInput = $bindable()
	}: Props = $props();

	let displayContent = $derived(isPreviewing ? contentInput : content);
</script>

{#if isEditing && !isPreviewing}
	<textarea
		bind:value={contentInput}
		class="content-input"
		placeholder="Enter content (supports HTML)"
		rows="8"
	></textarea>
{:else if displayContent}
	<div class="content-display">
		{@html displayContent}
	</div>
{/if}

<style>
	.content-input {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid var(--border);
		border-radius: 8px;
		background-color: transparent;
		color: var(--text-one);
		font-size: 1rem;
		font-family: inherit;
		letter-spacing: 0.02rem;
		resize: vertical;
		min-height: 150px;
	}

	.content-input:focus {
		outline: none;
		border-color: var(--primary);
	}

	.content-input::placeholder {
		color: var(--text-four);
		opacity: 0.6;
	}

	.content-display {
		color: var(--text-four);
		font-size: 1rem;
		line-height: 1.7;
	}

	.content-display :global(a) {
		color: var(--primary);
		font-weight: 600;
		font-size: 0.95rem;
		text-decoration: none;
	}

	.content-display :global(a:hover) {
		text-decoration: underline var(--secondary);
		color: var(--text-one);
	}

	.content-display :global(h2),
	.content-display :global(h3),
	.content-display :global(h4),
	.content-display :global(h5),
	.content-display :global(h6) {
		color: var(--secondary);
		margin-top: 1.25rem;
		margin-bottom: 1.25rem;
	}

	.content-display :global(h1) { font-size: 1.8rem; }
	.content-display :global(h2) { font-size: 1.6rem; }
	.content-display :global(h3) { font-size: 1.4rem; }
	.content-display :global(h4) { font-size: 1.2rem; }
	.content-display :global(h5) { font-size: 1.1rem; }
	.content-display :global(h6) { font-size: 1rem; }

	.content-display :global(li) {
		list-style-position: inside;
		font-size: 0.9rem;
		font-weight: 500;
	}
</style>
