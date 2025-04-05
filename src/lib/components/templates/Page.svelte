<script lang="ts">
	import type { Snippet } from 'svelte';
	import NavBar from '$components/organisms/NavBar.svelte';
	import Footer from '$components/organisms/Footer.svelte';

	type Props = { title?: string; children: Snippet };
	let { title, children }: Props = $props();
</script>

<svelte:head>
	{#if title}
		<title>ReVanced - {title.trim()}</title>
	{:else}
		<title>ReVanced</title>
	{/if}
</svelte:head>

<main>
	<NavBar />
	{@render children()}
	<Footer />
</main>
