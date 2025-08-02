<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Announcement from './Announcement.svelte';
	import type { PageData } from './$types';

	// Get data from your server load function
	export let data: PageData;

	console.log('Page component received data:', data);

	$: ({ isCreating, announcement, announcementId } = data);
</script>

<main class="wrapper" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	<Announcement {isCreating} {announcement} {announcementId} />
</main>
