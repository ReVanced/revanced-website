<script lang="ts">
	import moment from 'moment';
	import { onMount } from 'svelte';
	import type { ResponseAnnouncement } from '$lib/types';
	import NewHeader from './NewHeader.svelte';
	import { queries } from '$data/api';
	import { dev_log } from '$util/dev';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { read_announcements } from '$lib/stores';
	import TagsHost from './TagsHost.svelte';
	import Content from './[slug]/Content.svelte';
	import ToolTip from '$lib/components/ToolTip.svelte';
	import { relativeTime } from '$util/relativeTime';

	import Archive from 'svelte-material-icons/ArchiveOutline.svelte';

	export let announcement: ResponseAnnouncement;

	const client = useQueryClient();

	let isRead: boolean;

	function prefetch() {
		const query = queries['announcementById'](announcement.id);
		dev_log('Prefetching', query);
		client.prefetchQuery(query);
	}

	function setAnnouncementRead() {
		isRead = true;

		$read_announcements.add(announcement.id);
		localStorage.setItem('read_announcements', JSON.stringify(Array.from($read_announcements)));
	}

	onMount(() => {
		isRead = $read_announcements.has(announcement.id);
	});
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<a
	data-sveltekit-preload-data
	on:mouseenter={prefetch}
	href="/announcements/{announcement.id}"
	on:click={setAnnouncementRead}
>
	<div
		class="card"
		class:attachment={announcement.attachments && announcement.attachments.length > 0}
	>
		{#if isRead !== undefined && !isRead}
			<NewHeader />
		{/if}
		{#if announcement.attachments && announcement.attachments.length > 0}
			<img
				src={announcement.attachments[0]}
				class={isRead === undefined || isRead ? '' : 'no-border-radius'}
				alt="Banner"
				onerror="this.style.display='none'"
			/>
		{/if}
		<div class="content">
			<div class="header">
				<h3>{announcement.title}</h3>
				<span>
					{relativeTime(announcement.created_at)}
					{#if announcement.archived_at && moment(announcement.archived_at).isBefore(moment())}
						<ToolTip
							content={`This announcement was archived ${relativeTime(announcement.archived_at)}`}
						>
							<Archive size="24" />
						</ToolTip>
					{/if}
				</span>
			</div>
			<div class="footer">
				{#if announcement.content}
					<Content content={announcement.content} clamp={true} />
				{/if}
				{#if announcement.tags && announcement.tags.length > 0}
					<hr />
					<TagsHost
						tags={announcement.tags.map((tag) => ({ name: tag }))}
						expandable={false}
						clickable={false}
					/>
				{/if}
			</div>
		</div>
	</div>
</a>

<style lang="scss">
	a {
		text-decoration: inherit;
	}

	.card {
		&.attachment {
			grid-row: span 2;
		}
		&:hover {
			background-color: var(--surface-four);
			filter: none;
		}

		display: flex;
		flex-direction: column;
		height: 100%;

		background-color: var(--surface-seven);
		border: 1px solid var(--border);
		border-radius: 12px;

		img {
			height: 150px;
			object-fit: cover;
			width: 100%;
			border-radius: 12px 12px 0px 0px;

			&.no-border-radius {
				border-radius: 0;
			}
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
				overflow-wrap: anywhere;

				span {
					display: flex;
					gap: 4px;

					img {
						height: 24px;
						width: 24px;
					}
				}
			}

			.footer {
				gap: 12px;
			}
		}
	}
</style>
