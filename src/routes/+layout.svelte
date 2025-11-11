<script lang="ts">
	import '../app.css';
	import favicon from '$assets/favicon.ico';
	import NavBar from '$components/molecules/NavBar.svelte';
	import type { WithChildren } from '$types';

	let { children }: WithChildren = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<NavBar />
{@render children()}
