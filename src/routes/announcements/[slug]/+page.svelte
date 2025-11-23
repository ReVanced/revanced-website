<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { createQuery } from '@tanstack/svelte-query';
	import { queries } from '$data/api';
	import { page } from '$app/stores';
	import { replaceState } from '$app/navigation';
	import Announcement from './Announcement.svelte';
	import Query from '$lib/components/Query.svelte';

	let lastSegment = $derived($page.url.pathname.split('/').pop() ?? '');
	let isCreating = $derived(lastSegment === 'create');
	let announcementIdNumber = $derived(isCreating ? undefined : Number(lastSegment.split('-')[0]));

	let query = createQuery(() => ({
		...queries.announcementById(announcementIdNumber ?? 0),
		enabled: !!announcementIdNumber
	}));

	let announcement = $derived(query.data?.announcement);

	let slug = $derived(announcement?.title
		? announcement.title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-+|-+$/g, '')
		: '');

	$effect(() => {
		const slugPathname = `/announcements/${announcementIdNumber}-${slug}`;
		if (slug && $page.url.pathname !== slugPathname) {
			replaceState(slugPathname, {});
		}
	});
</script>

<main class="wrapper" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	{#if announcementIdNumber}
		<Query {query}>
			{#snippet children(data)}
				<Announcement {isCreating} {announcement} {announcementIdNumber} {query} />
			{/snippet}
		</Query>
	{:else}
		<Announcement {isCreating} {announcement} {announcementIdNumber} />
	{/if}
</main>