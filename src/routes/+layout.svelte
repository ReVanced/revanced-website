<script lang="ts">
	import '../app.css';
	import favicon from '$assets/favicon.ico';
	import type { WithChildren } from '$types';

	let { children }: WithChildren = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
