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
	import { page } from '$app/stores';

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

<!-- telemetry good -->
<svelte:head>
	<script>
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
	</script>
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-PLH0N9VQL5"></script>
	<!-- Sometimes you don't want telemetry -->
	<script>
		window.dataLayer = window.dataLayer || [];

		function gtag() {
			dataLayer.push(arguments);
		}

		function runClarity(c, l, a, r, i, t, y) {
			c[a] =
				c[a] ||
				function () {
					(c[a].q = c[a].q || []).push(arguments);
				};
			t = l.createElement(r);
			t.async = 1;
			t.src = 'https://www.clarity.ms/tag/' + i;
			y = l.getElementsByTagName(r)[0];
			y.parentNode.insertBefore(t, y);
		}

		function telemetryInit() {
			allowTelemetry = (localStorage.getItem('allowTelemetry') === 'true');
			if (!allowTelemetry) {
				gtag('set', 'allow_google_signals', false);
				return;
			}
			gtag('js', new Date());
			gtag('config', 'G-PLH0N9VQL5');
			runClarity(window, document, 'clarity', 'script', 'hfh8dhfgus');
		}

		telemetryInit();
	</script>
</svelte:head>

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
