<script lang="ts">
  import { derived } from "svelte/store";

	import NavHost from "$lib/components/molecules/NavHost.svelte";
  import Spinner from '$lib/components/atoms/Spinner.svelte';
  import RouterEvents from '../data/RouterEvents';
	import '../app.css';

  import type { PageData } from './$types';

  import { contributors } from "../data/api";

  export let data: PageData;
  contributors.init(data);

  // Just like the set/clearInterval example found here: https://svelte.dev/docs#run-time-svelte-store-derived
  const show_loading_animation = derived(RouterEvents, ($event, set) => {
    if ($event.navigating) {
      // Wait 250 ms before showing the animation.
      const timeout = setTimeout(() => set(true), 250);
      return () => clearTimeout(timeout);
    } else {
      set(false)
    }
  }, false);
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="og:title" content="ReVanced" />
	<meta name="og:image" itemprop="image" content="/embed.png" />
	<meta
		property="og:description"
		content="An extensible framework for building application mods."
	/>
	<meta name="twitter:image" itemprop="image" content="/embed.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="theme-color" content="#0f111a" />
	<title>ReVanced</title>
</svelte:head>

<NavHost />

{#if $show_loading_animation}
	<Spinner />
{:else}
	<slot />
{/if}
