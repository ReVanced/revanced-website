<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		content?: string;
		children: Snippet;
		tooltipContent?: Snippet;
		interactive?: boolean;
	};

	let { content, children, tooltipContent, interactive = false }: Props = $props();
</script>

<div class="tooltip-wrapper" tabindex="-1" role="presentation">
	{@render children()}
	<div class="tooltip" class:interactive role="tooltip">
		{#if tooltipContent}
			{@render tooltipContent()}
		{:else if content}
			{content}
		{/if}
	</div>
</div>

<style>
	.tooltip-wrapper {
		position: relative;
		display: inline-flex;
		outline: none;
	}

	.tooltip {
		position: absolute;
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		margin-bottom: 8px;
		padding: 0.75rem 1rem;
		background-color: var(--surface-three);
		color: var(--text-four);
		border-radius: 12px;
		font-size: 16px;
		font-weight: 500;
		white-space: nowrap;
		box-shadow: var(--drop-shadow-one);
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.2s ease,
			visibility 0.2s ease;
		z-index: var(--z-dropdown);
		pointer-events: none;
	}

	.tooltip::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		height: 12px;
	}

	@media (hover: hover) {
		.tooltip-wrapper:hover .tooltip {
			opacity: 1;
			visibility: visible;
		}

		.tooltip-wrapper:hover .tooltip.interactive {
			pointer-events: auto;
		}
	}

	@media (hover: none) {
		.tooltip-wrapper:focus-within .tooltip {
			opacity: 1;
			visibility: visible;
		}

		.tooltip-wrapper:focus-within .tooltip.interactive {
			pointer-events: auto;
		}
	}

	.tooltip :global(a) {
		color: var(--primary);
		text-decoration: none;
		font-size: 17px;
	}

	.tooltip :global(a:hover) {
		text-decoration: underline;
	}

	.tooltip :global(p) {
		margin: 0 0 0.25rem 0;
		font-size: 17px;
		color: var(--text-four);
		opacity: 0.8;
	}
</style>
