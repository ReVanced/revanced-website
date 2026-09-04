<script lang="ts">
	import '../app.css';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { browser } from '$app/environment';
	import { isScheduled } from '$lib/utils';
	import AppShell from '$components/organisms/AppShell.svelte';
	import type { WithChildren } from '$types';
	import { onMount } from 'svelte';
	import { theme } from '$stores';
	import { hydrated } from '$stores/hydrated.svelte';
	import { getQueryClient } from '$stores/queryClient';
	import { useHolidayTheme } from '$lib/utils/themeEvents.svelte';
	import type { LayoutData } from './$types';

	const queryClient = getQueryClient();

	let { children, data }: WithChildren & { data: LayoutData } = $props();
	useHolidayTheme();

	let publishedAnnouncements = $derived(
        (data.latestAnnouncements ?? []).filter(item => !isScheduled(item.announcement.created_at))
    );

	onMount(() => hydrated.markHydrated());

	$effect(() => {
		if (browser) {
			document.documentElement.setAttribute('data-theme', theme.current);
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<AppShell about={data.about} latestAnnouncements={publishedAnnouncements}>
		{@render children()}
	</AppShell>
</QueryClientProvider>
