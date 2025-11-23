<script lang="ts">
	import { read_announcements } from '$lib/stores.svelte';
	import Banner from '$layout/banners/Banner.svelte';
	import { goto } from '$app/navigation';
	import { createQuery, queryOptions } from '@tanstack/svelte-query';
	import { queries } from '$data/api';
	import moment from 'moment';
	import { type ResponseAnnouncement } from '$lib/types';

	const query = createQuery(() => queryOptions(queries.announcements()));

	let latestUnreadAnnouncement = $derived.by(() => {
		const announcements: ResponseAnnouncement[] = query.data?.announcements ?? [];

		const nonArchived = announcements.filter(
			(a) => !a.archived_at || moment(a.archived_at).isAfter(moment())
		);

		const announcement = nonArchived[0];

		return announcement && !read_announcements.value.has(announcement.id) ? announcement : undefined;
	});

	function setAsRead() {
		if (!latestUnreadAnnouncement) return;

		read_announcements.add(latestUnreadAnnouncement.id);
	}

	function handleClick() {
		if (!latestUnreadAnnouncement) return;

		goto(`/announcements/${latestUnreadAnnouncement.id}`);
		setAsRead();
	}

	function handleClose() {
		if (!latestUnreadAnnouncement) return;

		setAsRead();
	}

	function getBannerLevel(level: number | undefined): 'info' | 'caution' {
		if (!level || level == 0) return 'info';
		return 'caution';
	}
</script>

{#if latestUnreadAnnouncement}
	<Banner
		title={'We have an announcement'}
		description={`You can read more about "${latestUnreadAnnouncement.title}" in our latest post.`}
		level={getBannerLevel(latestUnreadAnnouncement.level)}
		buttonText="Read more"
		buttonOnClick={handleClick}
		onDismiss={handleClose}
	/>
{/if}
