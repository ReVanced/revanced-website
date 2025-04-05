<script lang="ts">
	import { theme } from '$lib/stores';
	import { onMount, type Snippet } from 'svelte';

	type Props = { children: Snippet };
	let { children }: Props = $props();

	onMount(() => {
		document.documentElement.setAttribute('data-theme', $theme);
	});
</script>

{@render children()}
