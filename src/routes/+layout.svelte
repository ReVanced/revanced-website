<script lang="ts" module>
	import { writable } from 'svelte/store';
	// There might be a better place to put this, but I am not entirely sure...
	export const isRestoring = writable(false);
</script>

<script lang="ts">
	import '../app.scss';
	import { derived } from 'svelte/store';
	import { browser } from '$app/environment';

	import { QueryClient } from '@tanstack/query-core';
	import { persistQueryClient } from '@tanstack/query-persist-client-core';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
	import { DateTrigger } from '$util/DateTrigger';

	import NavHost from '$layout/navbar/NavHost.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import ConsentDialog from '$layout/dialogs/ConsentDialog.svelte';
	import { staleTime } from '$data/api';
	import RouterEvents from '$data/routerEvents';
	import { registerThemeEvents } from '$util/themeEvents';

	import FooterHost from '$layout/footer/FooterHost.svelte';
	import { api_base_url, set_about_info } from '$data/api/settings';

	let { children } = $props();

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				gcTime: staleTime
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

	$effect(() => {
		set_about_info(api_base_url());
		const dt = new DateTrigger();
		registerThemeEvents(dt);

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
			{@render children()}
		{/if}
	</div>
	<FooterHost />
</QueryClientProvider>
