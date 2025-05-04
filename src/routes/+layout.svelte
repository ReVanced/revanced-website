<script lang="ts">
	import type { Snippet } from 'svelte';
	import { event } from '$stores';

	import Footer from '$components/organisms/Footer.svelte';
	import NavBar from '$components/organisms/NavBar.svelte';
	import Head from '$components/molecules/Head.svelte';

	type Props = { children: Snippet };
	let { children }: Props = $props();

	$effect(() => {
		document.documentElement.setAttribute('data-event-name', $event);
	});
</script>

<Head />

<NavBar />
<main>
	{@render children()}
</main>
<Footer />
