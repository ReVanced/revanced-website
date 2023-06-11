<script lang="ts" context="module">
	import { writable } from 'svelte/store';
	// There might be a better place to put this, but I am not entirely sure...
	export const isRestoring = writable(false);
	declare const telemetryInit: () => void;
</script>

<script lang="ts">
	import '../app.scss';
	import { derived } from 'svelte/store';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	import { QueryClient } from '@tanstack/query-core';
	import { persistQueryClient } from '@tanstack/query-persist-client-core';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

	import NavHost from '$layout/Navbar/NavHost.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import Dialogue from '$lib/components/Dialogue.svelte';
	import Button from '$lib/components/Button.svelte';
	import { staleTime } from '$data/api';
	import RouterEvents from '$data/RouterEvents';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				cacheTime: staleTime
			}
		}
	});

	let askCookieConsent = false;

	// store a cookie to remember the user's preference
	function setPrivacySetting(allowTelemetry: boolean) {
		localStorage.setItem('allowTelemetry', allowTelemetry.toString());
		askCookieConsent = false;
		if (typeof telemetryInit !== 'undefined') {
			telemetryInit();
		}
	}

	onMount(() => {
		if (!localStorage.getItem('allowTelemetry')) {
			askCookieConsent = true;
		}

		isRestoring.set(true);
		const [unsubscribe, promise] = persistQueryClient({
			queryClient,
			persister: createSyncStoragePersister({ storage: localStorage })
		});
		promise.then(() => isRestoring.set(false));
		return unsubscribe;
	});

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

<QueryClientProvider client={queryClient}>
	<NavHost />
	<!-- if cookie consent hasn't been set -->
	<Dialogue bind:modalOpen={askCookieConsent} notDismissible>
		<svelte:fragment slot="title">It's your choice</svelte:fragment>
		<svelte:fragment slot="description">
			This site uses analytics to understand better how you use it. Opting in is
			optional and won't impact your experience.
		</svelte:fragment>
		<svelte:fragment slot="buttons">
			<Button type="text" on:click={() => setPrivacySetting(false)}>Disallow all</Button>
			<Button type="text" on:click={() => setPrivacySetting(true)}>Accept</Button>
		</svelte:fragment>
	</Dialogue>

	{#if $show_loading_animation}
		<Spinner />
	{:else}
		<slot />
	{/if}
	<!-- guhh afn -->
	<!-- <Footer> -->
</QueryClientProvider>
