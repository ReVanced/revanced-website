<script lang="ts">
	import '../app.css';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { browser } from '$app/environment';

	import AppShell from '$components/organisms/AppShell.svelte';
	import type { WithChildren } from '$types';
	import { theme } from '$stores';
	import { getQueryClient } from '$stores/queryClient';
	import { useHolidayTheme } from '$lib/utils/themeEvents.svelte';
	import type { LayoutData } from './$types';

	const queryClient = getQueryClient();

	let { children, data }: WithChildren & { data: LayoutData } = $props();
	useHolidayTheme();

	$effect(() => {
		if (browser) {
			document.documentElement.setAttribute('data-theme', theme.current);
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<AppShell about={data.about} latestAnnouncements={data.latestAnnouncements}>
		{@render children()}
	</AppShell>
</QueryClientProvider>
