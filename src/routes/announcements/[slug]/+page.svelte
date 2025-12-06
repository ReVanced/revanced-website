<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import type { Announcement } from '$lib/api/types';
	import {
		fetchAnnouncementById,
		updateAnnouncement,
		deleteAnnouncement,
		archiveAnnouncement,
		unarchiveAnnouncement,
		type AnnouncementInput
	} from '$lib/api/client';
	import { auth, announcementsQuery } from '$stores';
	import TagChip from '$components/atoms/TagChip.svelte';
	import Button from '$components/atoms/Button.svelte';
	import Modal from '$components/molecules/Modal.svelte';
	import IconArchive from 'virtual:icons/material-symbols/inventory-2-outline';
	import IconEdit from 'virtual:icons/material-symbols/edit-outline';
	import IconDelete from 'virtual:icons/material-symbols/delete-outline';
	import IconSave from 'virtual:icons/material-symbols/check';
	import IconCancel from 'virtual:icons/material-symbols/close';
	import IconArchiveDown from 'virtual:icons/material-symbols/archive-outline';
	import IconUnarchive from 'virtual:icons/material-symbols/unarchive-outline';

	let announcement = $state<Announcement | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	// Edit mode state
	let isEditing = $state(false);
	let editTitle = $state('');
	let editContent = $state('');
	let editTags = $state('');
	let editAuthor = $state('');
	let saving = $state(false);
	let deleteConfirmOpen = $state(false);

	let isAdmin = $derived(auth.isLoggedIn);

	let announcementId = $derived.by(() => {
		const slug = $page.params.slug ?? '';
		if (!slug) return null;
		const idPart = slug.split('-')[0];
		const parsed = parseInt(idPart, 10);
		return isNaN(parsed) ? null : parsed;
	});

	$effect(() => {
		if (!browser || announcementId === null) return;

		loading = true;
		error = null;

		fetchAnnouncementById(announcementId)
			.then((data) => {
				announcement = data;
				loading = false;
				if (data?.title) {
					const titleSlug = data.title
						.toLowerCase()
						.replace(/[^a-z0-9]+/g, '-')
						.replace(/^-+|-+$/g, '');
					const expectedPath = `/announcements/${data.id}-${titleSlug}`;
					if ($page.url.pathname !== expectedPath) {
						history.replaceState({}, '', expectedPath);
					}
				}
			})
			.catch((err) => {
				error = err instanceof Error ? err.message : 'Failed to load announcement';
				loading = false;
			});
	});

	function isArchived(archivedAt: string | null): boolean {
		if (!archivedAt) return false;
		return new Date(archivedAt) < new Date();
	}

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function startEditing() {
		if (!announcement) return;
		editTitle = announcement.title;
		editContent = announcement.content ?? '';
		editTags = announcement.tags?.join(', ') ?? '';
		editAuthor = announcement.author ?? '';
		isEditing = true;
	}

	function cancelEditing() {
		isEditing = false;
	}

	async function saveChanges() {
		if (!announcement || !announcementId) return;
		saving = true;

		try {
			const input: AnnouncementInput = {
				title: editTitle.trim(),
				content: editContent.trim() || null,
				tags: editTags.split(',').map((t) => t.trim()).filter(Boolean),
			};

			await updateAnnouncement(announcementId, input);

			// Update local state
			announcement = {
				...announcement,
				title: input.title,
				content: input.content ?? null,
				tags: input.tags ?? []
			};

			isEditing = false;
			announcementsQuery.refetch();
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Failed to save');
		} finally {
			saving = false;
		}
	}

	async function handleDelete() {
		if (!announcementId) return;
		try {
			await deleteAnnouncement(announcementId);
			announcementsQuery.refetch();
			goto('/announcements');
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Failed to delete');
		}
	}

	async function toggleArchive() {
		if (!announcement || !announcementId) return;
		try {
			if (isArchived(announcement.archived_at)) {
				await unarchiveAnnouncement(announcementId);
				announcement = { ...announcement, archived_at: null };
			} else {
				await archiveAnnouncement(announcementId);
				announcement = { ...announcement, archived_at: new Date().toISOString() };
			}
			announcementsQuery.refetch();
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Failed to update archive status');
		}
	}
</script>

<svelte:head>
	<title>{announcement?.title ?? 'Announcement'} - ReVanced</title>
	<meta name="description" content={announcement?.content?.slice(0, 160) ?? 'ReVanced announcement'} />
</svelte:head>

<main class="wrapper" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	{#if loading}
		<div class="loading-state">
			<p>Loading announcement...</p>
		</div>
	{:else if error}
		<div class="error-state">
			<p>{error}</p>
			<a href="/announcements">← Back to announcements</a>
		</div>
	{:else if announcement}
		<article class="card">
			<header class="header">
				<div class="header-content">
					{#if isEditing}
						<input
							type="text"
							class="edit-title"
							bind:value={editTitle}
							placeholder="Title"
						/>
					{:else}
						<h1 class="title">
							{announcement.title}
							{#if isArchived(announcement.archived_at)}
								<span class="archived-badge" title="Archived">
									<IconArchive />
								</span>
							{/if}
						</h1>
					{/if}
					<div class="meta">
						<span class="date">{formatDate(announcement.created_at)}</span>
						{#if announcement.author}
							<span class="separator">•</span>
							<span class="author">by {announcement.author}</span>
						{/if}
					</div>
					{#if isEditing}
						<input
							type="text"
							class="edit-tags"
							bind:value={editTags}
							placeholder="Tags (comma separated)"
						/>
					{:else if announcement.tags && announcement.tags.length > 0}
						<div class="tags">
							{#each announcement.tags as tag}
								<TagChip {tag} />
							{/each}
						</div>
					{/if}
				</div>

				{#if isAdmin}
					<div class="admin-buttons">
						{#if isEditing}
							<Button icon={IconCancel} buttonStyle="icon" onclick={cancelEditing} disabled={saving} />
							<Button icon={IconSave} buttonStyle="icon" onclick={saveChanges} disabled={saving} />
						{:else}
							<Button
								icon={isArchived(announcement.archived_at) ? IconUnarchive : IconArchiveDown}
								buttonStyle="icon"
								onclick={toggleArchive}
							/>
							<Button icon={IconDelete} buttonStyle="icon" onclick={() => deleteConfirmOpen = true} />
							<Button icon={IconEdit} buttonStyle="icon" onclick={startEditing} />
						{/if}
					</div>
				{/if}
			</header>

			<hr class="divider" />

			{#if isEditing}
				<textarea
					class="edit-content"
					bind:value={editContent}
					placeholder="Content (HTML supported)"
					rows="10"
				></textarea>
			{:else}
				<div class="content">
					{@html announcement.content}
				</div>
			{/if}

			{#if announcement.attachments && announcement.attachments.length > 0}
				<hr class="divider" />
				<div class="attachments">
					{#each announcement.attachments as src, idx}
						<button
							type="button"
							class="attachment-item"
							onclick={() => window.open(src, '_blank')}
							aria-label={`View attachment ${idx + 1}`}
						>
							<img {src} alt={`Attachment ${idx + 1}`} loading="lazy" />
						</button>
					{/each}
				</div>
			{/if}
		</article>

		<a href="/announcements" class="back-link">← Back to announcements</a>
	{:else}
		<div class="error-state">
			<p>Announcement not found.</p>
			<a href="/announcements">← Back to announcements</a>
		</div>
	{/if}
</main>

<Modal title="Delete Announcement?" bind:open={deleteConfirmOpen}>
	<p class="confirm-text">Are you sure you want to delete this announcement? This action cannot be undone.</p>

	{#snippet buttons()}
		<div class="modal-buttons">
			<Button onclick={() => deleteConfirmOpen = false}>Cancel</Button>
			<Button variant="danger" onclick={handleDelete}>Delete</Button>
		</div>
	{/snippet}
</Modal>

<style>
	.wrapper {
		width: min(90%, 60rem);
		margin-inline: auto;
		padding-block: 2rem;
	}

	.loading-state,
	.error-state {
		text-align: center;
		padding: 3rem 1rem;
		color: var(--text-four);
	}

	.error-state a,
	.back-link {
		display: inline-block;
		margin-top: 1.5rem;
		color: var(--primary);
		font-weight: 500;
		text-decoration: none;
		transition: color 0.2s var(--bezier-one);
	}

	.error-state a:hover,
	.back-link:hover {
		color: var(--text-one);
		text-decoration: underline;
	}

	.card {
		background-color: var(--surface-eight);
		padding: 2rem;
		border-radius: 1rem;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}

	.header-content {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		flex: 1;
	}

	.admin-buttons {
		display: flex;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin: 0;
		font-size: 1.75rem;
		color: var(--text-one);
		line-height: 1.3;
	}

	.edit-title {
		font-size: 1.75rem;
		font-weight: bold;
		color: var(--text-one);
		background: var(--surface-four);
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		padding: 0.5rem 0.75rem;
		width: 100%;
	}

	.edit-title:focus {
		outline: none;
		border-color: var(--primary);
	}

	.edit-tags {
		font-size: 0.9rem;
		color: var(--text-four);
		background: var(--surface-four);
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		padding: 0.5rem 0.75rem;
		width: 100%;
	}

	.edit-tags:focus {
		outline: none;
		border-color: var(--primary);
	}

	.edit-content {
		width: 100%;
		min-height: 200px;
		font-size: 1rem;
		font-family: monospace;
		color: var(--text-four);
		background: var(--surface-four);
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		padding: 0.75rem;
		resize: vertical;
	}

	.edit-content:focus {
		outline: none;
		border-color: var(--primary);
	}

	.archived-badge {
		display: flex;
		align-items: center;
		color: var(--text-four);
	}

	.archived-badge :global(svg) {
		width: 24px;
		height: 24px;
	}

	.meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
		font-size: 0.9rem;
		color: var(--text-four);
	}

	.separator {
		color: var(--surface-six);
	}

	.author {
		font-weight: 500;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.25rem;
	}

	.divider {
		border: none;
		border-top: 1px solid var(--surface-six);
		margin: 1.5rem 0;
	}

	.content {
		color: var(--text-four);
		font-size: 1rem;
		line-height: 1.7;
	}

	.content :global(a) {
		color: var(--primary);
		font-weight: 600;
		text-decoration: none;
	}

	.content :global(a:hover) {
		text-decoration: underline;
		color: var(--text-one);
	}

	.content :global(h2),
	.content :global(h3),
	.content :global(h4),
	.content :global(h5),
	.content :global(h6) {
		color: var(--secondary);
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
	}

	.content :global(h1) { font-size: 1.8rem; }
	.content :global(h2) { font-size: 1.5rem; }
	.content :global(h3) { font-size: 1.3rem; }
	.content :global(h4) { font-size: 1.15rem; }

	.content :global(ul),
	.content :global(ol) {
		padding-left: 1.5rem;
	}

	.content :global(li) {
		margin-bottom: 0.5rem;
	}

	.content :global(p) {
		margin-bottom: 1rem;
	}

	.content :global(code) {
		background-color: var(--surface-four);
		padding: 0.2em 0.4em;
		border-radius: 4px;
		font-size: 0.9em;
	}

	.content :global(pre) {
		background-color: var(--surface-four);
		padding: 1rem;
		border-radius: 8px;
		overflow-x: auto;
	}

	.content :global(pre code) {
		background: none;
		padding: 0;
	}

	.attachments {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.attachment-item {
		display: block;
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
		overflow: hidden;
		border-radius: 0.5rem;
		transition: transform 0.2s var(--bezier-one);
	}

	.attachment-item:hover {
		transform: scale(1.02);
	}

	.attachment-item img {
		width: 100%;
		height: auto;
		display: block;
		border-radius: 0.5rem;
	}

	.confirm-text {
		color: var(--text-four);
		line-height: 1.5;
	}

	.modal-buttons {
		display: flex;
		gap: 0.5rem;
		justify-content: flex-end;
	}

	@media (max-width: 768px) {
		.wrapper {
			padding-block: 1rem;
		}

		.card {
			background-color: transparent;
			padding: 0;
			border-radius: 0;
		}

		.header {
			flex-direction: column;
		}

		.admin-buttons {
			align-self: flex-end;
		}

		.title {
			font-size: 1.4rem;
		}

		.edit-title {
			font-size: 1.4rem;
		}

		.divider {
			margin: 1rem 0;
		}
	}
</style>
