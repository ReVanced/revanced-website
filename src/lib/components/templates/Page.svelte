<script lang="ts">
	import type { Snippet } from 'svelte';
	import NavBar from '$components/organisms/NavBar.svelte';
	import Footer from '$components/organisms/Footer.svelte';

	type Props = { title?: string; children: Snippet };
	let { title, children }: Props = $props();

	const pageTitle = title ? `ReVanced - ${title.trim()}` : 'ReVanced';
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<main>
	<NavBar />
	{@render children()}
	<Footer />
</main>
