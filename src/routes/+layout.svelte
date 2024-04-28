<script lang="ts" context="module">
	import { writable } from 'svelte/store';
	// There might be a better place to put this, but I am not entirely sure...
	export const isRestoring = writable(false);
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

	let showConsentModal = false;

	function rememberChoice(allow: boolean) {
		localStorage.setItem('analytics', allow.toString());
		showConsentModal = false;

		if (allow) location.reload();
	}

	onMount(() => {
		// Check if the user has already decided.

		const hasDecided = localStorage.getItem('analytics') !== null;
		if (!hasDecided) showConsentModal = true;

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

<svelte:head>
	<!-- Google Tag Manager -->
	<script>
		allowAnalytics = localStorage.getItem('analytics') === 'true';
		if (allowAnalytics) {
			(function (w, d, s, l, i) {
				w[l] = w[l] || [];
				w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
				var f = d.getElementsByTagName(s)[0],
					j = d.createElement(s),
					dl = l != 'dataLayer' ? '&l=' + l : '';
				j.async = true;
				j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
				f.parentNode.insertBefore(j, f);
			})(window, document, 'script', 'dataLayer', 'GTM-MQ6K849');
		}
	</script>
</svelte:head>

<QueryClientProvider client={queryClient}>
	<NavHost />
	<Dialogue bind:modalOpen={showConsentModal} notDismissible>
		<svelte:fragment slot="title">It's your choice</svelte:fragment>
		<svelte:fragment slot="description">
			We use analytics to improve your experience on this site. By clicking "Allow", you allow us to
			collect anonymous data about your visit.
		</svelte:fragment>
		<svelte:fragment slot="buttons">
			<Button type="text" on:click={() => rememberChoice(false)}>Deny</Button>
			<Button type="filled" on:click={() => rememberChoice(true)}>Allow</Button>
		</svelte:fragment>
	</Dialogue>

	<div id="skiptab">
		{#if $show_loading_animation}
			<Spinner />
		{:else}
			<slot />
		{/if}
	</div>
	<!-- <Footer> -->
</QueryClientProvider>
