<script lang="ts">
	import '../app.css';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { PersistQueryClientProvider } from '@tanstack/svelte-query-persist-client';
	import { browser } from '$app/environment';

	import favicon from '$assets/icons/favicon.ico';
	import AppShell from '$components/organisms/AppShell.svelte';
	import Spinner from '$components/atoms/Spinner.svelte';
	import type { WithChildren } from '$types';
	import { theme } from '$stores';
	import { getQueryClient, createPersister } from '$stores/queryClient';
	import { useHolidayTheme } from '$lib/utils/themeEvents.svelte';

	const queryClient = getQueryClient();
	const persister = createPersister();

	let { children }: WithChildren = $props();
	useHolidayTheme();
	
	let isRestoring = $state(true);

	$effect(() => {
		if (browser) {
			document.documentElement.setAttribute('data-theme', theme.current);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if persister}
<PersistQueryClientProvider 
	client={queryClient} 
	persistOptions={{ persister }}
	onSuccess={() => { isRestoring = false; }}
>
	{#if isRestoring}
		<div class="restore-loading">
			<Spinner />
		</div>
	{:else}
		<AppShell>
			{@render children()}
		</AppShell>
	{/if}
</PersistQueryClientProvider>
{:else}
<QueryClientProvider client={queryClient}>
	<AppShell>
		{@render children()}
	</AppShell>
</QueryClientProvider>
{/if}

<style>
	.restore-loading {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background: var(--background);
	}
</style>