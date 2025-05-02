<script lang="ts">
	import type { Snippet } from 'svelte';
	import { theme } from '$stores';

	import Footer from '$components/organisms/Footer.svelte';
	import NavBar from '$components/organisms/NavBar.svelte';
	import Head from '$components/molecules/Head.svelte';

	type Props = { children: Snippet };
	let { children }: Props = $props();

	$effect(() => {
		document.documentElement.setAttribute('data-theme', $theme);
	});
</script>

<Head />

<NavBar />
<main>
	{@render children()}
</main>
<Footer />
