<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import moment from 'moment';
	import type { Announcement } from '$lib/api/types';
	import { relativeTime, formatUTC } from '$lib/utils/relativeTime';
	import { isValidUrl } from '$lib/utils/url';
	import {
		fetchAnnouncementById,
		createAnnouncement,
		updateAnnouncement,
		deleteAnnouncement,
		type AnnouncementPayload
	} from '$lib/api/client';
	import {
		getCachedAnnouncement,
		cacheAnnouncement,
		hasValidCachedAnnouncement,
		announcementsQuery,
		invalidateAnnouncementCache,
		auth
	} from '$stores';
	import { isArchived, toSlug } from '$lib/utils/announcement';
	import TagChip from '$components/atoms/TagChip.svelte';
	import Gallery from '$components/molecules/Gallery.svelte';
	import IconArchive from 'svelte-material-icons/ArchiveArrowDownOutline.svelte';
	import AdminButtons from './AdminButtons.svelte';
	import EditableHeader from './EditableHeader.svelte';
	import EditableContent from './EditableContent.svelte';
	import EditableLists from './EditableLists.svelte';
	import DeleteConfirmDialog from './DeleteConfirmDialog.svelte';

	let announcement = $state<Announcement | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	let isEditing = $state(false);
	let isPreviewing = $state(false);
	let showDeleteConfirm = $state(false);

	let isCreating = $derived($page.params.slug === 'create');

	let announcementId = $derived.by(() => {
		if (isCreating) return null;
		const slug = $page.params.slug ?? '';
		if (!slug) return null;
		const idPart = slug.split('-')[0];
		const parsed = parseInt(idPart, 10);
		return isNaN(parsed) ? null : parsed;
	});

	let titleInput = $state('');
	let contentInput = $state('');
	let authorInput = $state('');
	let createdAtInput = $state('');
	let archivedAtInput = $state('');
	let tagsInput = $state<string[]>([]);
	let attachmentsInput = $state<string[]>([]);

	function initializeDraft() {
		if (isCreating) {
			titleInput = '';
			contentInput = '';
			authorInput = '';
			createdAtInput = moment().format('YYYY-MM-DDTHH:mm');
			archivedAtInput = '';
			tagsInput = [];
			attachmentsInput = [];
		} else if (announcement) {
			titleInput = announcement.title ?? '';
			contentInput = announcement.content ?? '';
			authorInput = announcement.author ?? '';
			createdAtInput = announcement.created_at
				? moment(announcement.created_at).format('YYYY-MM-DDTHH:mm')
				: moment().format('YYYY-MM-DDTHH:mm');
			archivedAtInput = announcement.archived_at
				? moment(announcement.archived_at).format('YYYY-MM-DDTHH:mm')
				: '';
			tagsInput = [...(announcement.tags ?? [])];
			attachmentsInput = [...(announcement.attachments ?? [])];
		}
	}

	$effect(() => {
		if (isCreating && browser) {
			if (!auth.isLoggedIn) {
				goto('/announcements');
				return;
			}
			initializeDraft();
			loading = false;
		}
	});

	$effect(() => {
		if (!browser || announcementId === null || isCreating) return;

		// Check cache first
		const cached = getCachedAnnouncement(announcementId);
		if (cached) {
			announcement = cached;
			loading = false;

			// Update URL if needed
			if (cached.title) {
				const expectedPath = `/announcements/${cached.id}-${toSlug(cached.title)}`;
				if ($page.url.pathname !== expectedPath) {
					history.replaceState({}, '', expectedPath);
				}
			}

			// If cache is valid, we're done; otherwise refetch in background
			if (hasValidCachedAnnouncement(announcementId)) {
				return;
			}
		} else {
			loading = true;
		}

		error = null;

		const abortController = new AbortController();

		fetchAnnouncementById(announcementId, abortController.signal)
			.then((data) => {
				if (abortController.signal.aborted) return;
				announcement = data;
				cacheAnnouncement(data);
				loading = false;
				if (data?.title) {
					const expectedPath = `/announcements/${data.id}-${toSlug(data.title)}`;
					if ($page.url.pathname !== expectedPath) {
						history.replaceState({}, '', expectedPath);
					}
				}
			})
			.catch((err) => {
				if (abortController.signal.aborted) return;
				if (!announcement) {
					goto('/announcements');
					return;
				}
				loading = false;
			});

		return () => {
			abortController.abort();
		};
	});

	function validateInputs(): boolean {
		const hasEmptyTitle = !titleInput.trim();
		const hasInvalidAttachments = attachmentsInput.some((a) => a && !isValidUrl(a));

		if (hasEmptyTitle || hasInvalidAttachments) {
			const issues = [
				hasEmptyTitle && 'Title',
				hasInvalidAttachments && 'Attachments'
			].filter(Boolean);
			alert(`${issues.join(' and ')} must be filled properly`);
			return false;
		}
		return true;
	}

	function buildPayload(): AnnouncementPayload {
		const createdAtFormatted = createdAtInput ? formatUTC(createdAtInput) : undefined;
		const archivedAtFormatted = archivedAtInput ? formatUTC(archivedAtInput) : null;
		
		return {
			title: titleInput.trim(),
			content: contentInput.trim() || undefined,
			author: authorInput.trim() || undefined,
			tags: tagsInput.length > 0 ? tagsInput : undefined,
			attachments: attachmentsInput.filter((a) => a && isValidUrl(a)).length > 0
				? attachmentsInput.filter((a) => a && isValidUrl(a))
				: undefined,
			created_at: createdAtFormatted || undefined,
			archived_at: typeof archivedAtFormatted === 'string' ? archivedAtFormatted : null
		};
	}

	function onEdit() {
		initializeDraft();
		isEditing = true;
	}

	function onCancel() {
		isEditing = false;
		isPreviewing = false;
	}

	async function onSave() {
		auth.refresh();
		if (!auth.isLoggedIn) {
			goto('/');
			return;
		}

		if (!validateInputs()) return;

		const payload = buildPayload();

		try {
			if (isCreating) {
				await createAnnouncement(payload);
				await announcementsQuery.refetch();
				goto('/announcements');
			} else if (announcementId !== null) {
				const updated = await updateAnnouncement(announcementId, payload);
				announcement = updated;
				cacheAnnouncement(updated);
				invalidateAnnouncementCache(announcementId);
				await announcementsQuery.refetch();
				isEditing = false;
				isPreviewing = false;
			}
		} catch (err) {
			if (err instanceof Error && err.message === 'Unauthenticated') {
				goto('/');
				return;
			}
			alert(err instanceof Error ? err.message : 'An error occurred');
		}
	}

	function onDelete() {
		showDeleteConfirm = true;
	}

	async function confirmDelete() {
		if (announcementId === null) return;
		auth.refresh();
		if (!auth.isLoggedIn) {
			showDeleteConfirm = false;
			goto('/');
			return;
		}

		try {
			await deleteAnnouncement(announcementId);
			invalidateAnnouncementCache(announcementId);
			await announcementsQuery.refetch();
			goto('/announcements');
		} catch (err) {
			if (err instanceof Error && err.message === 'Unauthenticated') {
				showDeleteConfirm = false;
				goto('/');
				return;
			}
			alert(err instanceof Error ? err.message : 'Failed to delete announcement');
		}
		showDeleteConfirm = false;
	}

	function cancelDelete() {
		showDeleteConfirm = false;
	}

	function onTogglePreview() {
		isPreviewing = !isPreviewing;
	}

	function onToggleArchive() {
		if (archivedAtInput) {
			archivedAtInput = '';
		} else {
			archivedAtInput = moment().format('YYYY-MM-DDTHH:mm');
		}
	}

	function handleBeforeUnload(e: BeforeUnloadEvent) {
		if (isEditing || isCreating) {
			e.preventDefault();
			e.returnValue = '';
		}
	}

	let isEditMode = $derived(isEditing || isCreating);
</script>

<svelte:window onbeforeunload={handleBeforeUnload} />

<DeleteConfirmDialog
	bind:open={showDeleteConfirm}
	onConfirm={confirmDelete}
	onCancel={cancelDelete}
/>

<main class="wrapper" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	{#if loading && !isCreating}
		<div class="loading-state">
			<p>Loading announcement...</p>
		</div>
	{:else if error && !isCreating}
		<div class="error-state">
			<p>{error}</p>
			<a href="/announcements">← Back to announcements</a>
		</div>
	{:else if announcement || isCreating}
		<article class="card">
			<header class="header">
				<div class="header-content">
					{#if isEditMode}
						<h1 class="title">
							<EditableHeader
								field="title"
								isEditing={isEditMode}
								{isPreviewing}
								title={announcement?.title ?? ''}
								bind:titleInput
							/>
							{#if archivedAtInput && isPreviewing}
								<span class="archived-badge" title="Archived">
									<IconArchive size={20} />
								</span>
							{/if}
						</h1>
					{:else}
						<h1 class="title">
							{announcement?.title}
							{#if isArchived(announcement?.archived_at ?? null)}
								<span class="archived-badge" title="Archived">
									<IconArchive size={20} />
								</span>
							{/if}
						</h1>
					{/if}

					<h4 class="meta">
						{#if isEditMode}
							<EditableHeader
								field="date"
								isEditing={isEditMode}
								{isPreviewing}
								createdAt={announcement?.created_at ?? ''}
								bind:createdAtInput
								archivedAt={announcement?.archived_at ?? null}
								bind:archivedAtInput
							/>
							<EditableHeader
								field="author"
								isEditing={isEditMode}
								{isPreviewing}
								author={announcement?.author ?? null}
								bind:authorInput
							/>
						{:else}
							{relativeTime(announcement?.created_at ?? '')}
							{#if announcement?.author}
								·
								{announcement.author}
							{/if}
						{/if}
					</h4>

					{#if isEditMode}
						<EditableLists
							field="tags"
							isEditing={isEditMode}
							{isPreviewing}
							bind:tagsInput
						/>
					{:else if announcement?.tags && announcement.tags.length > 0}
						<div class="tags">
							{#key announcement.tags.length}
								{#each announcement.tags as tag}
									<TagChip {tag} clickable={false} />
								{/each}
							{/key}
						</div>
					{/if}
				</div>

				{#if auth.isLoggedIn}
					<AdminButtons
						{isEditing}
						{isCreating}
						{isPreviewing}
						hasArchivedAt={!!archivedAtInput}
						{onEdit}
						{onCancel}
						{onSave}
						{onDelete}
						{onTogglePreview}
						{onToggleArchive}
					/>
				{/if}
			</header>

			<hr class="divider" />

			{#if isEditMode}
				<EditableContent
					isEditing={isEditMode}
					{isPreviewing}
					content={announcement?.content ?? null}
					bind:contentInput
				/>
			{:else}
				<div class="content">
					{@html announcement?.content}
				</div>
			{/if}

			{#if isEditMode}
				<hr class="divider" />
				<EditableLists
					field="attachments"
					isEditing={isEditMode}
					{isPreviewing}
					attachments={announcement?.attachments ?? []}
					bind:attachmentsInput
				/>
			{:else if announcement?.attachments && announcement.attachments.length > 0}
				<hr class="divider" />
				<div class="attachments">
					<Gallery images={announcement.attachments} columns={3} gap="0.75rem" />
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
		margin-top: 1rem;
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

		.title {
			font-size: 1.4rem;
		}

		.divider {
			margin: 1rem 0;
		}
	}
</style>
