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
	import { DateTriggerEventHandler } from 'datetrigger';

	import NavHost from '$layout/Navbar/NavHost.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import ConsentDialog from '$layout/Dialogs/ConsentDialog.svelte';
	import { staleTime } from '$data/api';
	import RouterEvents from '$data/RouterEvents';
	import { events as themeEvents } from '$util/themeEvents';

	import FooterHost from '$layout/Footer/FooterHost.svelte';
	import { api_base_url, set_about_info } from '$data/api/settings';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				cacheTime: staleTime
			}
		}
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

	onMount(() => {
		set_about_info(api_base_url());
		// new DateTriggerEventHandler(themeEvents);

		isRestoring.set(true);
		const [unsubscribe, promise] = persistQueryClient({
			queryClient,
			persister: createSyncStoragePersister({ storage: localStorage })
		});
		promise.then(() => isRestoring.set(false));
		return unsubscribe;
	});
</script>

<ConsentDialog />

<QueryClientProvider client={queryClient}>
	<NavHost />
	<div id="skiptab">
		{#if $show_loading_animation}
			<Spinner />
		{:else}
			<slot />
		{/if}
	</div>
	<FooterHost />
</QueryClientProvider>
