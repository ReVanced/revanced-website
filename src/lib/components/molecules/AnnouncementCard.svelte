<script lang="ts">
	import type { Announcement } from '$api';
	import TagsFilter from '$components/molecules/TagsFilter.svelte';
	import ToolTip from '$components/atoms/ToolTip.svelte';
	import { readAnnouncements, announcementsQuery } from '$stores';
	import IconArchive from 'virtual:icons/material-symbols/archive-outline';

	type Props = {
		announcement: Announcement;
	};

	let { announcement }: Props = $props();

	let isRead = $derived(readAnnouncements.isRead(announcement.id));

	function handleClick() {
		readAnnouncements.markAsRead(announcement.id);
	}

	function prefetch() {
		announcementsQuery.refetch();
	}

	const toSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

	function relativeTime(dateStr: string, withinDays = 7) {
		const date = new Date(dateStr);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (diffDays <= withinDays) {
			const diffMins = Math.floor(diffMs / 60000);
			const diffHrs = Math.floor(diffMins / 60);

			if (diffMins < 1) return 'just now';
			if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
			if (diffHrs < 24) return `${diffHrs} hour${diffHrs !== 1 ? 's' : ''} ago`;
			return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
		}

		const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		const month = months[date.getMonth()];
		const day = date.getDate();
		const year = date.getFullYear();
		let hours = date.getHours();
		const mins = date.getMinutes().toString().padStart(2, '0');
		const ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12 || 12;

		return `on ${month} ${day}, ${year} at ${hours}:${mins} ${ampm}`;
	}

	function checkArchived(archivedAt: string | null): boolean {
		if (!archivedAt) return false;
		return new Date(archivedAt) < new Date();
	}

	let href = $derived(`/announcements/${announcement.id}-${toSlug(announcement.title)}`);
	let hasImage = $derived(announcement.attachments && announcement.attachments.length > 0);
	let archived = $derived(checkArchived(announcement.archived_at));
	let createdTime = $derived(relativeTime(announcement.created_at));
	let archivedTime = $derived(announcement.archived_at ? relativeTime(announcement.archived_at) : '');
</script>

<a
	{href}
	class="card-link"
	data-sveltekit-preload-data
	onmouseenter={prefetch}
	onclick={handleClick}
>
	<article class="card" class:attachment={hasImage}>
		{#if !isRead}
			<span class="new-header">NEW</span>
		{/if}

		{#if hasImage}
			<img
				src={announcement.attachments[0]}
				alt="Banner"
				class="card-image"
				class:no-border-radius={!isRead}
				onerror={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
			/>
		{/if}

		<div class="content">
			<header class="header">
				<h3>{announcement.title}</h3>
				<span class="meta">
					{createdTime}
					{#if archived}
						<ToolTip content="This announcement was archived {archivedTime}">
							<IconArchive />
						</ToolTip>
					{/if}
				</span>
			</header>

			<footer class="footer">
				{#if announcement.content}
					<div class="content-body">
						{@html announcement.content}
					</div>
				{/if}

				{#if announcement.tags && announcement.tags.length > 0}
					<hr />
					<TagsFilter tags={announcement.tags} clickable={false} />
				{/if}
			</footer>
		</div>
	</article>
</a>

<style>
	.card-link {
		text-decoration: inherit;
	}

	.card {
		display: flex;
		flex-direction: column;
		height: 100%;
		background-color: var(--surface-seven);
		border: 1px solid var(--border);
		border-radius: 12px;
		transition: background-color 0.5s ease, transform 0.2s ease;
	}

	.card:hover {
		background-color: var(--surface-four);
		filter: none;
	}

	.card.attachment {
		grid-row: span 2;
	}

	.new-header {
		text-align: center;
		background-color: var(--surface-four);
		color: var(--primary);
		font-weight: bold;
		padding: 4px 0;
		border-radius: 12px 12px 0 0;
		pointer-events: none;
		letter-spacing: 0.05em;
	}

	.card-image {
		height: 150px;
		object-fit: cover;
		width: 100%;
		border-radius: 12px 12px 0px 0px;
	}

	.card-image.no-border-radius {
		border-radius: 0;
	}

	.content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 12px;
		height: 100%;
		padding: 12px 16px;
		color: var(--text-four);
	}

	.header,
	.footer {
		display: flex;
		flex-direction: column;
		overflow-wrap: anywhere;
	}

	.header h3 {
		margin: 0;
		color: var(--secondary);
		font-size: 1.17em;
		font-weight: 600;
	}

	.meta {
		display: flex;
		gap: 4px;
		align-items: center;
		font-size: 0.9rem;
		color: var(--text-four);
	}

	.meta :global(svg) {
		height: 24px;
		width: 24px;
	}

	.footer {
		gap: 12px;
	}

	.content-body {
		color: var(--text-four);
		display: -webkit-inline-box;
		line-clamp: 3;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.content-body :global(a) {
		pointer-events: none;
	}

	.content-body :global(h1),
	.content-body :global(h2),
	.content-body :global(h3),
	.content-body :global(h4),
	.content-body :global(h5),
	.content-body :global(h6) {
		color: var(--secondary);
		line-height: 1.75rem;
		margin: 0;
	}

	hr {
		border: none;
		border-top: 1px solid var(--border);
		margin: 0;
	}
</style>
