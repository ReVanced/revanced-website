<script lang="ts">
	import '../app.css';
	import favicon from '$assets/favicon.ico';
	import NavBar from '$components/organisms/NavBar.svelte';
	import ModalBackground from '$components/atoms/ModalBackground.svelte';
	import type { WithChildren } from '$types';

	let { children }: WithChildren = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<NavBar />

<ModalBackground />

{@render children()}
