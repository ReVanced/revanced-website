<script lang="ts">
	import '../app.scss';
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

<NavHost />

{#if $show_loading_animation}
	<Spinner />
{:else}
	<slot />
{/if}
<!--
     afn if you are moving the footer here, please make it not use the repositories store directly and instead use component props :) -->

<!-- <Footer repos={$repositories}> -->
