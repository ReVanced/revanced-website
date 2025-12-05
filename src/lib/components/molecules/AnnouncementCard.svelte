<script lang="ts">
	import type { Announcement } from '$api';
	import TagChip from '$components/atoms/TagChip.svelte';
	import ToolTip from '$components/atoms/ToolTip.svelte';
	import { readAnnouncements } from '$stores';
	import IconArchive from 'virtual:icons/material-symbols/archive-outline';

	type Props = {
		announcement: Announcement;
		isNew?: boolean;
	};

	let { announcement, isNew = false }: Props = $props();

	let isRead = $derived(readAnnouncements.isRead(announcement.id));

	function handleClick() {
		readAnnouncements.markAsRead(announcement.id);
	}

	const toSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

	function formatRelativeTime(str: string) {
		const diff = Date.now() - new Date(str).getTime();
		const mins = Math.floor(diff / 60000);
		const hrs = Math.floor(mins / 60);
		const days = Math.floor(hrs / 24);

		const fmt = (n: number, unit: string) => `${n} ${unit}${n > 1 ? 's' : ''} ago`;

		if (days >= 365) return fmt(Math.floor(days / 365), 'year');
		if (days >= 30) return fmt(Math.floor(days / 30), 'month');
		if (days >= 7) return fmt(Math.floor(days / 7), 'week');
		if (days > 0) return fmt(days, 'day');
		if (hrs > 0) return fmt(hrs, 'hour');
		if (mins > 0) return fmt(mins, 'minute');
		return 'just now';
	}

	function checkArchived(archivedAt: string | null): boolean {
		if (!archivedAt) return false;
		return new Date(archivedAt) < new Date();
	}

	let href = $derived(`/announcements/${announcement.id}-${toSlug(announcement.title)}`);
	let hasImage = $derived(announcement.attachments && announcement.attachments.length > 0);
	let archived = $derived(checkArchived(announcement.archived_at));
	let createdTime = $derived(formatRelativeTime(announcement.created_at));
	let archivedTime = $derived(announcement.archived_at ? formatRelativeTime(announcement.archived_at) : '');
</script>

<a {href} class="card-link" data-sveltekit-preload-data onclick={handleClick}>
	<article class="card" class:has-image={hasImage} class:is-read={isRead}>
		{#if isNew}
			<div class="new-badge">NEW</div>
		{:else if !isRead}
			<div class="unread-dot"></div>
		{/if}

		{#if hasImage}
			<img
				src={announcement.attachments[0]}
				alt=""
				class="card-image"
				class:no-top-radius={isNew}
				loading="lazy"
			/>
		{/if}

		<div class="card-content">
			<header class="card-header">
				<h3 class="card-title">{announcement.title}</h3>
				<div class="card-meta">
					<span class="card-date">{createdTime}</span>
					{#if archived}
						<ToolTip content="Archived {archivedTime}">
							<span class="archive-icon">
								<IconArchive />
							</span>
						</ToolTip>
					{/if}
				</div>
			</header>

			<footer class="card-footer">
				{#if announcement.content}
					<p class="card-excerpt">{@html announcement.content}</p>
				{/if}

				{#if announcement.tags && announcement.tags.length > 0}
					<hr class="card-divider" />
					<div class="card-tags">
						{#each announcement.tags as tag}
							<TagChip {tag} clickable={false} />
						{/each}
					</div>
				{/if}
			</footer>
		</div>
	</article>
</a>

<style>
	.card-link {
		text-decoration: none;
		display: block;
	}

	.card {
		display: flex;
		flex-direction: column;
		height: 100%;
		background-color: var(--surface-seven);
		border: 1px solid var(--border);
		border-radius: 12px;
		overflow: hidden;
		transition: background-color 0.2s var(--bezier-one);
		position: relative;
	}

	.card:hover {
		background-color: var(--surface-four);
	}

	.card.has-image {
		grid-row: span 2;
	}

	.new-badge {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		background-color: var(--surface-four);
		color: var(--primary);
		text-align: center;
		font-size: 0.75rem;
		font-weight: 700;
		padding: 4px 0;
		letter-spacing: 0.05em;
		z-index: 1;
		border-radius: 12px 12px 0 0;
	}

	.unread-dot {
		position: absolute;
		top: 12px;
		right: 12px;
		width: 10px;
		height: 10px;
		background-color: var(--primary);
		border-radius: 50%;
		z-index: 1;
		box-shadow: 0 0 0 3px var(--surface-seven);
	}

	.card.is-read {
		opacity: 0.75;
	}

	.card.is-read:hover {
		opacity: 1;
	}

	.card-image {
		width: 100%;
		height: 150px;
		object-fit: cover;
		border-radius: 12px 12px 0 0;
	}

	.card-image.no-top-radius {
		border-radius: 0;
	}

	.card-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 12px;
		flex: 1;
		padding: 12px 16px;
		color: var(--text-four);
	}

	.card-header {
		display: flex;
		flex-direction: column;
		overflow-wrap: anywhere;
	}

	.card-title {
		color: var(--text-one);
		margin: 0 0 4px 0;
		font-size: 1rem;
	}

	.card-meta {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 0.85rem;
		color: var(--text-four);
	}

	.archive-icon {
		display: flex;
		align-items: center;
		color: var(--surface-six);
	}

	.archive-icon :global(svg) {
		width: 20px;
		height: 20px;
	}

	.card-footer {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.card-excerpt {
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--text-four);
	}

	.card-excerpt :global(a) {
		pointer-events: none;
		color: inherit;
		text-decoration: none;
	}

	.card-excerpt :global(h1),
	.card-excerpt :global(h2),
	.card-excerpt :global(h3),
	.card-excerpt :global(h4),
	.card-excerpt :global(h5),
	.card-excerpt :global(h6) {
		font-size: 0.9rem;
		margin: 0;
		color: var(--secondary);
	}

	.card-divider {
		border: none;
		border-top: 1px solid var(--border);
		margin: 0;
	}

	.card-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}
</style>
