<script lang="ts">
	import Footer from '$layout/Footer/FooterHost.svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { createQuery } from '@tanstack/svelte-query';
	import { queries } from '$data/api';
	import { page } from '$app/stores';
	import Announcement from './Announcement.svelte';
	import Query from '$lib/components/Query.svelte';

	let announcementIdNumber: number | undefined = undefined;
	let isCreating: boolean = false;

	$: {
		const lastSegment = $page.url.pathname.split('/').pop();
		isCreating = lastSegment === 'create';
		announcementIdNumber = isCreating ? undefined : Number(lastSegment);
	}

	$: query = announcementIdNumber
		? createQuery(queries.announcementById(announcementIdNumber))
		: null;

	$: announcement = $query?.data?.announcement || undefined;
</script>

<main class="wrapper" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	{#if query}
		<Query {query}>
			<Announcement {isCreating} {announcement} {announcementIdNumber} {query} />
		</Query>
	{:else}
		<Announcement {isCreating} {announcement} {announcementIdNumber} />
	{/if}
</main>

<Footer />
