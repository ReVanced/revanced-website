<script lang="ts">
	import { derived } from 'svelte/store';

	import NavHost from '$layout/Navbar/NavHost.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import RouterEvents from '$data/RouterEvents';

	// Just like the set/clearInterval example found here: https://svelte.dev/docs#run-time-svelte-store-derived
	const show_loading_animation = derived(
		RouterEvents,
		($event, set) => {
			if ($event.navigating) {
				// Wait 250 ms before showing the animation.
				const timeout = setTimeout(() => set(true), 250);
				return () => clearTimeout(timeout);
			} else {
				set(false);
			}
		},
		false
	);
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="og:title" content="ReVanced" />
	<meta content="/embed.png" property="og:image" />
	<meta property="og:description" content="Continuing the legacy of Vanced." />
	<meta name="twitter:image" itemprop="image" content="/embed.png" />
	<meta name="twitter:card" content="summary" />
	<meta name="theme-color" content="#9FD5FF" />
</svelte:head>

<NavHost />

{#if $show_loading_animation}
	<Spinner />
{:else}
	<slot />
{/if}
<!--
     afn if you are moving the footer here, please make it not use the repositories store directly and instead use component props :) -->
<!-- <Footer repos={$repositories}> -->

<style lang="scss" global>
	@import '../app.scss';
</style>
