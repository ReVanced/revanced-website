<script lang="ts">
	import { browser } from '$app/environment';
	import type { Snippet } from 'svelte';

	type Props = {
		content?: string;
		children: Snippet;
		tooltipContent?: Snippet;
		interactive?: boolean;
	};

	let { content, children, tooltipContent, interactive = false }: Props = $props();

	let wrapperEl = $state<HTMLElement | undefined>();
	let tooltipEl = $state<HTMLElement | undefined>();
	// Start off-screen so the first hover never flashes at a wrong position
	let posStyle = $state('left:-9999px;top:-9999px;');
	let visible = $state(false);
	let hideTimer: ReturnType<typeof setTimeout> | undefined;

	const GAP = 8;       // gap between trigger and tooltip
	const MARGIN = 8;    // minimum distance from viewport edges

	function reposition() {
		if (!browser || !wrapperEl || !tooltipEl) return;

		const trigger = wrapperEl.getBoundingClientRect();
		const tw = tooltipEl.offsetWidth;
		const th = tooltipEl.offsetHeight;
		const vw = window.innerWidth;

		// Center horizontally above the trigger, then clamp to viewport edges
		let x = trigger.left + trigger.width / 2 - tw / 2;
		x = Math.max(MARGIN, Math.min(x, vw - tw - MARGIN));

		// Position above the trigger
		const y = trigger.top - th - GAP;

		posStyle = `left:${x}px;top:${y}px;`;
	}

	function show() {
		clearTimeout(hideTimer);
		reposition();
		visible = true;
	}

	function scheduleHide() {
		if (interactive) {
			// Small delay lets the mouse travel from trigger to tooltip
			hideTimer = setTimeout(() => { visible = false; }, 100);
		} else {
			visible = false;
		}
	}

	$effect(() => {
		if (!browser || !wrapperEl) return;

		wrapperEl.addEventListener('mouseenter', show);
		wrapperEl.addEventListener('mouseleave', scheduleHide);
		wrapperEl.addEventListener('focusin', show);
		wrapperEl.addEventListener('focusout', scheduleHide);

		return () => {
			wrapperEl!.removeEventListener('mouseenter', show);
			wrapperEl!.removeEventListener('mouseleave', scheduleHide);
			wrapperEl!.removeEventListener('focusin', show);
			wrapperEl!.removeEventListener('focusout', scheduleHide);
		};
	});

	// Keep interactive tooltip open while the mouse is over it
	$effect(() => {
		if (!browser || !interactive || !tooltipEl) return;

		tooltipEl.addEventListener('mouseenter', show);
		tooltipEl.addEventListener('mouseleave', scheduleHide);

		return () => {
			tooltipEl!.removeEventListener('mouseenter', show);
			tooltipEl!.removeEventListener('mouseleave', scheduleHide);
		};
	});
</script>

<div class="tooltip-wrapper" bind:this={wrapperEl} tabindex="-1" role="presentation">
	{@render children()}
	<div
		class="tooltip"
		class:visible
		class:interactive
		role="tooltip"
		bind:this={tooltipEl}
		style={posStyle}
	>
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
		/* Fixed escapes overflow:hidden on any ancestor (e.g. archive collapse container)
		   and overflow-x:clip on html/body, so the tooltip is always fully visible. */
		position: fixed;
		/* left / top set by JS; initial off-screen value prevents flash on first hover */
		max-width: 260px;
		padding: 0.5rem 0.875rem;
		background-color: var(--surface-three);
		color: var(--text-four);
		border-radius: 12px;
		font-size: 0.875rem;
		font-weight: 500;
		line-height: 1.5;
		text-align: center;
		white-space: normal;
		word-break: break-word;
		box-shadow: var(--drop-shadow-one);
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.2s ease,
			visibility 0.2s ease;
		z-index: var(--z-modal);
		pointer-events: none;
	}

	.tooltip.visible {
		opacity: 1;
		visibility: visible;
	}

	.tooltip.visible.interactive {
		pointer-events: auto;
	}

	.tooltip :global(a) {
		color: var(--primary);
		text-decoration: none;
		font-size: 0.9375rem;
	}

	.tooltip :global(a:hover) {
		text-decoration: underline;
	}

	.tooltip :global(p) {
		margin: 0 0 0.25rem 0;
		font-size: 0.9375rem;
		color: var(--text-four);
		opacity: 0.8;
	}
</style>
