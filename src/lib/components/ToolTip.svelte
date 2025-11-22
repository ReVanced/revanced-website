<script lang="ts">
	import { tooltip } from 'svooltip';
	import '../styles/ToolTip.scss';

	let {
		content,
		html = false,
		children
	}: {
		content?: string | undefined;
		html?: boolean;
		children?: any;
	} = $props();
</script>

{#if content}
	<div
		use:tooltip={{
			content: content,
			html: html
		}}
	>
		{@render children?.()}
	</div>
{:else}
	{@render children?.()}
{/if}

<style>
	:root {
		--svooltip-bg: var(--surface-three);
		--svooltip-text: var(--text-four);
		--svooltip-padding: 0.75rem 1rem;
		--svooltip-weight: bold;
		--svooltip-text-size: 16px;
		--svooltip-shadow: var(--drop-shadow-one);
		--svooltip-arrow-size: 0;
		--svooltip-roundness: 12px;
	}
</style>
