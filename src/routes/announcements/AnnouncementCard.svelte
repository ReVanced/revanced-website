<script lang="ts">
	import moment from 'moment';
	import { onMount } from 'svelte';

	import type { Announcement } from '$lib/types';
	import UnreadDot from './UnreadDot.svelte';
	import ChannelChip from './ChannelChip.svelte';
	import ChannelsHost from './ChannelsHost.svelte';

	export let announcement: Announcement;

	let showContent = false;
	let isRead: boolean;
	let isUserAdmin: boolean = true; // TODO: add logic later

	function isAnnouncementRead() {
		isRead = (localStorage.getItem('read_announcements') ?? '')
			.split(',')
			.includes(String(announcement.id));
	}

	function setAnnouncementRead() {
		const ids = (localStorage.getItem('read_announcements') ?? '').split(',').filter((id) => !!id);
		if (!ids.includes(String(announcement.id)))
			localStorage.setItem('read_announcements', ids.concat(String(announcement.id)).join(','));
		isRead = true;
	}

	const showAnnouncement = () => {
		showContent = true;
		setAnnouncementRead();
	};

	onMount(isAnnouncementRead);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<a href="/announcements/{announcement.id}">
	<div class="card {announcement.attachmentUrls?.length > 0 ? 'attachment' : 'no-attachment'}">
		{#if isRead !== undefined && !isRead}
			<UnreadDot animated />
		{/if}
		{#if announcement.attachmentUrls?.length > 0}
			<img src={announcement.attachmentUrls[0]} alt="Banner" onerror="this.style.display='none'" />
		{/if}
		<div class="content">
			<div class="header">
				<h3>{announcement.title}</h3>
				<div class="description">
					{@html announcement.content}
				</div>
			</div>
			<div class="footer">
				<hr />
				<span class="date">
					{moment(announcement.createdAt.value).format('MMMM DD, YYYY')}
				</span>
			</div>
		</div>
	</div>
</a>

<style lang="scss">
	a {
		color: inherit !important;
		text-decoration: inherit !important;
		font-weight: inherit !important;
		font-size: inherit !important;
		user-select: none !important;
	}

	hr {
		justify-content: end;
	}

	.card {
		&.attachment {
			grid-row: span 2;
		}

		display: flex;
		flex-direction: column;
		height: 100%;

		background-color: var(--surface-seven);
		border: 1px solid var(--border);
		border-radius: 12px;
		&:hover {
			background-color: var(--surface-four);
		}

		img {
			height: 150px;
			object-fit: cover;
			width: 100%;
			border-radius: 12px 12px 0px 0px;
		}

		.content {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			gap: 12px;

			height: 100%;
			padding: 12px 16px;

			color: var(--text-four);

			.header,
			.footer {
				display: flex;
				flex-direction: column;
				gap: 12px;
			}

			.description {
				display: -webkit-inline-box;
				line-clamp: 3;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}
		}
	}
</style>
