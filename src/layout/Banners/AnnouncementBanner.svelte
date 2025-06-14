<script lang="ts">
	import { read_announcements } from '$lib/stores';
	import Banner from '$layout/Banners/Banner.svelte';
	import { goto } from '$app/navigation';
	import type { ResponseAnnouncement } from '$lib/types';
	import { browser } from '$app/environment';
	import { createQuery } from '@tanstack/svelte-query';
	import { queries } from '$data/api';
	import moment from 'moment';

	let latestUnreadAnnouncement: ResponseAnnouncement | undefined = undefined;

	const query = createQuery(queries.announcements());

	$: {
		if ($query.data?.announcements && $query.data.announcements.length > 0) {
			const nonArchived = $query.data.announcements.filter(
				(a) => !a.archived_at || moment(a.archived_at).isAfter(moment())
			);
			const announcement = nonArchived[0];

			if (announcement && !$read_announcements.has(announcement.id)) {
				latestUnreadAnnouncement = announcement;
			} else {
				latestUnreadAnnouncement = undefined;
			}
		}
	}

	function setAsRead() {
		if (!latestUnreadAnnouncement) return;
		$read_announcements.add(latestUnreadAnnouncement.id);
		localStorage.setItem('read_announcements', JSON.stringify(Array.from($read_announcements)));
		latestUnreadAnnouncement = undefined;
	}

	function handleClick() {
		if (latestUnreadAnnouncement) {
			goto(`/announcements/${latestUnreadAnnouncement.id}`);
			setAsRead();
		}
	}

	function handleClose() {
		if (latestUnreadAnnouncement && browser) {
			setAsRead();
		}
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
