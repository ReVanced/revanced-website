<script lang="ts">
	import type { Announcement } from '$api';
	import TagsFilter from '$components/molecules/TagsFilter.svelte';
	import ToolTip from '$components/atoms/ToolTip.svelte';
	import { readAnnouncements } from '$stores';
	import { browser } from '$app/environment';
	import { relativeTime } from '$lib/utils/relativeTime';
	import { isArchived, buildAnnouncementPath } from '$lib/utils';
	import IconArchive from 'svelte-material-icons/ArchiveOutline.svelte';

	type Props = {
		announcement: Announcement;
	};

	let { announcement }: Props = $props();

	let isRead = $derived(readAnnouncements.isRead(announcement));

	function handleClick() {
		readAnnouncements.markAsRead(announcement);
	}

	let href = $derived(buildAnnouncementPath(announcement.id, announcement.title));
	let archived = $derived(isArchived(announcement.archived_at));
	let createdTime = $derived(relativeTime(announcement.created_at));
	let archivedTime = $derived(
		announcement.archived_at ? relativeTime(announcement.archived_at) : ''
	);
</script>

<a {href} class="card-link" data-sveltekit-preload-data onclick={handleClick}>
	<article class="card">
		{#if browser && !isRead && !archived}
			<span class="new-header">NEW</span>
		{/if}

		<div class="content">
			<header class="header">
				<h3>{announcement.title}</h3>
				<span class="meta">
					{createdTime}
					{#if archived}
						<ToolTip content="This announcement was archived {archivedTime}">
							<IconArchive size={18} />
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
		transition:
			background-color 0.5s ease,
			transform 0.2s ease;
	}

	.card:hover {
		background-color: var(--surface-four);
		filter: none;
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
		display: -webkit-box;
		line-clamp: 3;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.content-body :global(a) {
		pointer-events: none;
		color: var(--primary);
		font-weight: 600;
		font-size: 0.95rem;
		text-decoration: none;
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

	.content-body :global(h1) {
		font-size: 1.8rem;
	}

	.content-body :global(h2) {
		font-size: 1.6rem;
	}

	.content-body :global(h3) {
		font-size: 1.4rem;
	}

	.content-body :global(h4) {
		font-size: 1.2rem;
	}

	.content-body :global(h5) {
		font-size: 1.1rem;
	}

	.content-body :global(h6) {
		font-size: 1rem;
	}

	.content-body :global(li) {
		list-style-position: inside;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.content-body :global(p) {
		margin: 0;
	}
</style>
