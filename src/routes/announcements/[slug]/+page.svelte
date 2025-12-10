<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { Announcement } from '$lib/api/types';
	import { relativeTime } from '$lib/utils/relativeTime';
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
	import IconPreview from 'virtual:icons/material-symbols/visibility-outline';
	import IconHidePreview from 'virtual:icons/material-symbols/visibility-off-outline';

	let announcement = $state<Announcement | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	// Edit mode state
	let isEditing = $state(false);
	let isPreviewing = $state(false);
	let editTitle = $state('');
	let editContent = $state('');
	let editTags = $state('');
	let editAuthor = $state('');
	let editLevel = $state(0);
	let editAttachments = $state('');
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

	let hasUnsavedChanges = $derived.by(() => {
		if (!isEditing || !announcement) return false;
		const originalAttachments = announcement.attachments?.join('\n') ?? '';
		const originalTags = announcement.tags?.join(', ') ?? '';
		return (
			editTitle !== announcement.title ||
			editContent !== (announcement.content ?? '') ||
			editTags !== originalTags ||
			editAuthor !== (announcement.author ?? '') ||
			editLevel !== (announcement.level ?? 0) ||
			editAttachments !== originalAttachments
		);
	});

	onMount(() => {
		function handleBeforeUnload(event: BeforeUnloadEvent) {
			if (hasUnsavedChanges) {
				event.preventDefault();
				event.returnValue = '';
			}
		}

		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
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

	function startEditing() {
		if (!announcement) return;
		editTitle = announcement.title;
		editContent = announcement.content ?? '';
		editTags = announcement.tags?.join(', ') ?? '';
		editAuthor = announcement.author ?? '';
		editLevel = announcement.level ?? 0;
		editAttachments = announcement.attachments?.join('\n') ?? '';
		isEditing = true;
		isPreviewing = false;
	}

	function cancelEditing() {
		isEditing = false;
		isPreviewing = false;
	}

	function togglePreview() {
		isPreviewing = !isPreviewing;
	}

	function parseAttachments(raw: string): string[] {
		return raw
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line.length > 0 && isValidUrl(line));
	}

	function isValidUrl(str: string): boolean {
		try {
			new URL(str);
			return true;
		} catch {
			return false;
		}
	}

	async function saveChanges() {
		if (!announcement || !announcementId) return;

		if (!editTitle.trim()) {
			alert('Title is required');
			return;
		}

		const attachmentUrls = parseAttachments(editAttachments);
		const invalidCount = editAttachments
			.split('\n')
			.filter((l) => l.trim())
			.length - attachmentUrls.length;

		if (invalidCount > 0) {
			alert(`${invalidCount} attachment URL(s) are invalid and will be ignored`);
		}

		saving = true;

		try {
			const input: AnnouncementInput = {
				title: editTitle.trim(),
				content: editContent.trim() || null,
				tags: editTags.split(',').map((t) => t.trim()).filter(Boolean),
				level: editLevel,
				attachments: attachmentUrls.length > 0 ? attachmentUrls : undefined
			};

			await updateAnnouncement(announcementId, input);

			announcement = {
				...announcement,
				title: input.title,
				content: input.content ?? null,
				tags: input.tags ?? [],
				level: input.level ?? 0,
				attachments: input.attachments ?? []
			};

			isEditing = false;
			isPreviewing = false;
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
						<div class="edit-meta-row">
							<input
								type="text"
								class="edit-author"
								bind:value={editAuthor}
								placeholder="Author"
							/>
							<label class="edit-level-label">
								Level:
								<select class="edit-level" bind:value={editLevel}>
									<option value={0}>Info (0)</option>
									<option value={1}>Warning (1)</option>
									<option value={2}>Severe (2)</option>
								</select>
							</label>
						</div>
					{:else}
						<h1 class="title">
							{announcement.title}
							{#if isArchived(announcement.archived_at)}
								<span class="archived-badge" title="Archived">
									<IconArchive />
								</span>
							{/if}
							{#if announcement.level && announcement.level > 0}
								<span class="level-badge level-{announcement.level}" title="Level {announcement.level}">
									{announcement.level === 1 ? 'Warning' : 'Severe'}
								</span>
							{/if}
						</h1>
					{/if}
					<h4 class="meta">
						{relativeTime(announcement.created_at)}
						{#if announcement.author}
							·
							{announcement.author}
						{/if}
					</h4>
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
				<div class="edit-section">
					<label class="field-label">
						Content (HTML supported)
						{#if isPreviewing}
							<button type="button" class="preview-toggle" onclick={togglePreview}>
								Hide Preview
							</button>
						{:else}
							<button type="button" class="preview-toggle" onclick={togglePreview}>
								Show Preview
							</button>
						{/if}
					</label>
					<textarea
						class="edit-content"
						bind:value={editContent}
						placeholder="Content (HTML supported)"
						rows="10"
					></textarea>
					{#if isPreviewing && editContent}
						<div class="preview-pane">
							<div class="preview-label">Preview</div>
							<div class="preview-content">
								{@html editContent}
							</div>
						</div>
					{/if}
				</div>

				<div class="edit-section">
					<span class="field-label">Attachment URLs (one per line)</span>
					<textarea
						class="edit-attachments"
						bind:value={editAttachments}
						placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.png"
						rows="4"
					></textarea>
				</div>
			{:else}
				<div class="content">
					{@html announcement.content}
				</div>
			{/if}

			{#if !isEditing && announcement.attachments && announcement.attachments.length > 0}
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
		width: min(90%, 80rem);
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
		margin-bottom: 3rem;
	}

	.header {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 2rem;
	}

	.header-content {
		display: flex;
		flex-direction: column;
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
		font-size: 2.5rem;
		color: var(--text-one);
		line-height: 4rem;
		letter-spacing: -0.025em;
	}

	.edit-title {
		font-size: 2.5rem;
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
		display: inline-flex;
		align-items: center;
		flex-wrap: wrap;
		column-gap: 1rem;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}

	.divider {
		border: none;
		height: 8px;
		width: 100%;
		background-image: url("data:image/svg+xml,%3Csvg width='91' height='8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M114 4c-5.067 4.667-10.133 4.667-15.2 0S88.667-.667 83.6 4 73.467 8.667 68.4 4 58.267-.667 53.2 4 43.067 8.667 38 4 27.867-.667 22.8 4 12.667 8.667 7.6 4-2.533-.667-7.6 4s-10.133 4.667-15.2 0S-32.933-.667-38 4s-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0' stroke='%23465969' stroke-linecap='square'/%3E%3C/svg%3E");
		background-repeat: repeat-x;
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
		font-size: 0.95rem;
		text-decoration: none;
	}

	.content :global(a:hover) {
		text-decoration: underline var(--secondary);
		color: var(--text-one);
	}

	.content :global(h2),
	.content :global(h3),
	.content :global(h4),
	.content :global(h5),
	.content :global(h6) {
		color: var(--secondary);
		margin-top: 1.25rem;
		margin-bottom: 1.25rem;
	}

	.content :global(h1) { font-size: 1.8rem; }
	.content :global(h2) { font-size: 1.6rem; }
	.content :global(h3) { font-size: 1.4rem; }
	.content :global(h4) { font-size: 1.2rem; }
	.content :global(h5) { font-size: 1.1rem; }
	.content :global(h6) { font-size: 1rem; }

	.content :global(ul),
	.content :global(ol) {
		padding-left: 1.5rem;
	}

	.content :global(li) {
		list-style-position: inside;
		margin-bottom: 0.5rem;
		font-size: 0.9rem;
		font-weight: 500;
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

	.edit-meta-row {
		display: flex;
		gap: 1rem;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 0.5rem;
	}

	.edit-author {
		flex: 1;
		min-width: 150px;
		font-size: 0.9rem;
		color: var(--text-four);
		background: var(--surface-four);
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		padding: 0.5rem 0.75rem;
	}

	.edit-author:focus {
		outline: none;
		border-color: var(--primary);
	}

	.edit-level-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		color: var(--text-four);
	}

	.edit-level {
		font-size: 0.9rem;
		color: var(--text-four);
		background: var(--surface-four);
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		padding: 0.4rem 0.6rem;
	}

	.edit-level:focus {
		outline: none;
		border-color: var(--primary);
	}

	.level-badge {
		display: inline-flex;
		align-items: center;
		padding: 0.2rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.level-badge.level-1 {
		background: rgba(255, 193, 7, 0.2);
		color: #ffc107;
	}

	.level-badge.level-2 {
		background: rgba(244, 67, 54, 0.2);
		color: #f44336;
	}

	.edit-section {
		margin-bottom: 1.5rem;
	}

	.field-label {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.85rem;
		color: var(--text-four);
		margin-bottom: 0.5rem;
		font-weight: 500;
	}

	.preview-toggle {
		font-size: 0.8rem;
		color: var(--primary);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.2rem 0.4rem;
		border-radius: 0.25rem;
	}

	.preview-toggle:hover {
		background: var(--surface-four);
	}

	.preview-pane {
		margin-top: 1rem;
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.preview-label {
		font-size: 0.75rem;
		color: var(--text-four);
		background: var(--surface-four);
		padding: 0.4rem 0.75rem;
		border-bottom: 1px solid var(--border);
	}

	.preview-content {
		padding: 0.75rem;
		color: var(--text-four);
		line-height: 1.6;
	}

	.edit-attachments {
		width: 100%;
		min-height: 80px;
		font-size: 0.9rem;
		font-family: monospace;
		color: var(--text-four);
		background: var(--surface-four);
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		padding: 0.75rem;
		resize: vertical;
	}

	.edit-attachments:focus {
		outline: none;
		border-color: var(--primary);
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
