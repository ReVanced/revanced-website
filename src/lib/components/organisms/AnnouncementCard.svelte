<script lang="ts">
	import type { Announcement } from '$api';
	import TagsFilter from '$components/molecules/TagsFilter.svelte';
	import ToolTip from '$components/atoms/ToolTip.svelte';
	import { readAnnouncements } from '$stores';
	import { hydrated } from '$stores/hydrated.svelte';
	import { browser } from '$app/environment';
	import { displayTime, isoDateTime } from '$lib/utils/relativeTime';
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
	let createdTime = $derived(displayTime(announcement.created_at, hydrated.current));
	let archivedTime = $derived(
		announcement.archived_at ? displayTime(announcement.archived_at, hydrated.current) : ''
	);
</script>

<!--
	Don't wrap the whole card in a single <a>. announcement.content is arbitrary HTML injected with {@html} and the announcement bodies already have their own <a> tags.

	That means we would end up with nested anchors which is invalid HTML. The browser then rewrites the SSR markup before Svelte gets to hydrate it so the DOM no longer matches the template and hydration blows up with "Node.appendChild: Cannot add children to a Text".

	So instead the anchor only wraps the title and we stretch it over the card using an ::after overlay. Same clickable-card behavior, valid markup, and still just one keyboard focus stop per card.
-->

<article class="card">
	{#if browser && !isRead && !archived}
		<span class="new-header">NEW</span>
	{/if}

	<div class="content">
		<header class="header">
			<h3>
				<a {href} class="card-link" data-sveltekit-preload-data onclick={handleClick}>
					{announcement.title}
				</a>
			</h3>
			<span class="meta">
				<time datetime={isoDateTime(announcement.created_at)}>{createdTime}</time>
				{#if archived}
					<span class="meta-interactive">
						<ToolTip content="This announcement was archived {archivedTime}">
							<IconArchive size={18} />
						</ToolTip>
					</span>
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

<style>
	.card-link {
		text-decoration: inherit;
		color: inherit;
	}

	/* Stretch the title link over the whole card so the entire card stays clickable without nesting the announcement body inside an anchor */
	.card-link::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 12px;
		z-index: 1;
	}

	.card-link:focus-visible::after {
		outline: 2px solid var(--primary);
		outline-offset: 2px;
	}

	/* Keep the archive tooltip hoverable above the stretched overlay. */
	.meta-interactive {
		position: relative;
		z-index: 2;
		display: inline-flex;
		align-items: center;
	}

	.card {
		position: relative;
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
