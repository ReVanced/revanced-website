<script lang="ts">
	import type { Snippet } from 'svelte';

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
