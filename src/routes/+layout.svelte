<script lang="ts" context="module">
	import { writable } from 'svelte/store';
	// There might be a better place to put this, but I am not entirely sure...
	export const isRestoring = writable(false);
</script>

<script lang="ts">
	import '../app.css';
	import { derived } from 'svelte/store';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	import { QueryClient } from '@tanstack/svelte-query';
	import { QueryClientProvider } from '@tanstack/svelte-query';

	import NavHost from '$layout/Navbar/NavHost.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import ConsentDialog from '$layout/Dialogs/ConsentDialog.svelte';
	import { staleTime } from '$data/api';
	import RouterEvents from '$data/RouterEvents';

	import FooterHost from '$layout/Footer/FooterHost.svelte';
	import { api_base_url, set_about_info } from '$data/api/settings';
	import { checkThemeEvents } from '$lib/themeEvents';

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

	onMount(() => {
		set_about_info(api_base_url());
		checkThemeEvents();

		// isRestoring.set(true);
		// const [unsubscribe, promise] = persistQueryClient({
		// 	queryClient,
		// 	persister: createSyncStoragePersister({ storage: localStorage })
		// });
		// promise.then(() => isRestoring.set(false));
		// return unsubscribe;

		// Cleanup query client on unmount
		return () => {
			queryClient.clear();
		};
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
