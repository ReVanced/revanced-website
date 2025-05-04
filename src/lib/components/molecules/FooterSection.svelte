<script lang="ts">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import ChevronDown from '~icons/mdi/chevron-down';

	type Props = { title: string; children: Snippet };
	let { title, children }: Props = $props();

	let expanded: boolean = $state(false);
</script>

<div class="desktop-only">
	<span>{title}</span>
	<ul>
		{@render children()}
	</ul>
</div>

<div class="mobile-only">
	<button class="title" onclick={() => (expanded = !expanded)}>
		<span>
			{title}
		</span>
		<div class="arrow" style:transform={expanded ? 'rotate(180deg)' : 'rotate(0deg)'}>
			<ChevronDown color="var(--surface-six)" />
		</div>
	</button>
	{#if expanded}
		<ul transition:slide={{ easing: quintOut, duration: 500 }}>
			{@render children()}
		</ul>
	{/if}
</div>
