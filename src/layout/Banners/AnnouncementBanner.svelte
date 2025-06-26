<script lang="ts">
	import { read_announcements } from '$lib/stores';
	import Banner from '$layout/Banners/Banner.svelte';
	import { goto } from '$app/navigation';
	import { createQuery } from '@tanstack/svelte-query';
	import { queries } from '$data/api';
	import moment from 'moment';

	const query = createQuery(queries.announcements());

	$: latestUnreadAnnouncement = (() => {
		const announcements = $query.data?.announcements ?? [];

		const nonArchived = announcements.filter(
			(a) => !a.archived_at || moment(a.archived_at).isAfter(moment())
		);

		const announcement = nonArchived[0];

		return announcement && !$read_announcements.has(announcement.id) ? announcement : undefined;
	})();

	function setAsRead() {
		if (!latestUnreadAnnouncement) return;

		read_announcements.update((set) => {
			const updated = new Set(set);
			updated.add(latestUnreadAnnouncement.id);
			return updated;
		});
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
