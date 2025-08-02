<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { createQuery } from '@tanstack/svelte-query';
	import { queries } from '$data/api';
	import { page } from '$app/stores';
	import Announcement from './Announcement.svelte';
	import Query from '$lib/components/Query.svelte';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let announcementIdNumber: number | undefined = undefined;
	let isCreating: boolean = false;

	$: {
		const lastSegment = $page.url.pathname.split('/').pop();
		isCreating = lastSegment === 'create';
		announcementIdNumber = isCreating ? undefined : Number(lastSegment.split('-')[0]);
	}

	$: query =
		isReady && browser && announcementIdNumber
			? createQuery(queries.announcementById(announcementIdNumber))
			: null;

	$: announcement = $query?.data?.announcement || undefined;

	$: slug = announcement?.title
		? announcement.title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-+|-+$/g, '')
		: '';

	$: {
		const slugPathname = `/announcements/${announcementIdNumber}-${slug}`;
		if (slug && $page.url.pathname !== slugPathname) {
			window.history.replaceState(null, '', slugPathname);
		}
	}

	let isReady = false;

	onMount(() => {
		isReady = true;
	});
</script>

<main class="wrapper" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	{#if !isReady}
		<div></div>
	{:else}
		<Query {query}>...</Query>
	{/if}
</main>
