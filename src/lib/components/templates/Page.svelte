<script lang="ts">
	import type { Snippet } from 'svelte';
	import NavBar from '$components/organisms/NavBar.svelte';
	import Footer from '$components/organisms/Footer.svelte';

	type Props = { children: Snippet };
	let { children }: Props = $props();
</script>

<main>
	<NavBar />
	{@render children()}
	<Footer />
</main>
