<script lang="ts">
	interface Props {
		html: string | null;
		class?: string;
	}

	let { html, class: className = '' }: Props = $props();
</script>

{#if html}
	<div class="announcement-content {className}">
		{@html html}
	</div>
{/if}

<style>
	.announcement-content {
		color: var(--text-four);
		font-size: 1rem;
		line-height: 1.7;
	}

	.announcement-content :global(a) {
		color: var(--primary);
		font-weight: 600;
		font-size: 0.95rem;
		text-decoration: none;
	}

	.announcement-content :global(a:hover) {
		text-decoration: underline var(--secondary);
		color: var(--text-one);
	}

	.announcement-content :global(h2),
	.announcement-content :global(h3),
	.announcement-content :global(h4),
	.announcement-content :global(h5),
	.announcement-content :global(h6) {
		color: var(--secondary);
		margin-top: 1.25rem;
		margin-bottom: 1.25rem;
	}

	.announcement-content :global(h1) { font-size: 1.8rem; }
	.announcement-content :global(h2) { font-size: 1.6rem; }
	.announcement-content :global(h3) { font-size: 1.4rem; }
	.announcement-content :global(h4) { font-size: 1.2rem; }
	.announcement-content :global(h5) { font-size: 1.1rem; }
	.announcement-content :global(h6) { font-size: 1rem; }

	.announcement-content :global(ul),
	.announcement-content :global(ol) {
		padding-left: 1.5rem;
	}

	.announcement-content :global(li) {
		list-style-position: inside;
		margin-bottom: 0.5rem;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.announcement-content :global(p) {
		margin-bottom: 1rem;
	}

	.announcement-content :global(code) {
		background-color: var(--surface-four);
		padding: 0.2em 0.4em;
		border-radius: 4px;
		font-size: 0.9em;
	}

	.announcement-content :global(pre) {
		background-color: var(--surface-four);
		padding: 1rem;
		border-radius: 8px;
		overflow-x: auto;
	}

	.announcement-content :global(pre code) {
		background: none;
		padding: 0;
	}
</style>
