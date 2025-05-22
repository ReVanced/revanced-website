<script lang="ts">
	import type { Snippet } from 'svelte';
	import { event } from '$stores';

	import Footer from '$components/organisms/Footer.svelte';
	import NavBar from '$components/organisms/NavBar.svelte';
	import Head from '$components/molecules/Head.svelte';

	type Props = { children: Snippet };
	let { children }: Props = $props();

	// set this to true to enable debug outlines on all elements
	const debug = false;
</script>

<svelte:document
	{@attach (doc) => {
		doc.documentElement.setAttribute('data-event-name', $event);
	}}
/>

<Head />

<NavBar />
<main>
	{@render children()}
</main>
<Footer />

{#if debug}
	<style global>
		* {
			outline: 1px solid #f002 !important;
			outline-offset: -1px;
		}
	</style>
{/if}
