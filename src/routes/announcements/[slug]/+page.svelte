<script lang="ts">
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { goto, replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import type { Announcement } from '$lib/api/types';
	import { formatUTC, formatDateTimeLocal } from '$lib/utils/relativeTime';
	import { isValidUrl, toSlug, isScheduled } from '$lib/utils';
	import {
		fetchAnnouncementById,
		createAnnouncement,
		updateAnnouncement,
		deleteAnnouncement,
		type AnnouncementPayload
	} from '$lib/api/client';
	import {
		useAnnouncementsQuery,
		useInvalidateAnnouncements,
		auth
	} from '$stores';
	import Content from './Content.svelte';
	import DeleteConfirmDialog from './DeleteConfirmDialog.svelte';

	const announcementsQuery = useAnnouncementsQuery();
	const invalidateAnnouncements = useInvalidateAnnouncements();

	let announcement = $state<Announcement | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	let isEditing = $state(false);
	let isPreviewing = $state(false);
	let showDeleteConfirm = $state(false);

	let isCreating = $derived(page.params.slug === 'create');

	let announcementId = $derived.by(() => {
		if (isCreating) return null;
		const slug = page.params.slug ?? '';
		if (!slug) return null;
		const idPart = slug.split('-')[0];
		const parsed = parseInt(idPart, 10);
		return isNaN(parsed) ? null : parsed;
	});
	let isInvalidSlug = $derived(!isCreating && announcementId === null);

	let titleInput = $state('');
	let contentInput = $state('');
	let authorInput = $state('');
	let createdAtInput = $state('');
	let archivedAtInput = $state('');
	let tagsInput = $state<string[]>([]);
	let attachmentsInput = $state<string[]>([]);
	let draftInitialized = $state(false);

	function initializeDraft() {
		if (isCreating) {
			titleInput = '';
			contentInput = '';
			authorInput = '';
			createdAtInput = formatDateTimeLocal(new Date());
			archivedAtInput = '';
			tagsInput = [];
			attachmentsInput = [];
		} else if (announcement) {
			titleInput = announcement.title ?? '';
			contentInput = announcement.content ?? '';
			authorInput = announcement.author ?? '';
			createdAtInput = announcement.created_at
				? formatDateTimeLocal(announcement.created_at)
				: formatDateTimeLocal(new Date());
			archivedAtInput = announcement.archived_at
				? formatDateTimeLocal(announcement.archived_at)
				: '';
			tagsInput = [...(announcement.tags ?? [])];
			attachmentsInput = [...(announcement.attachments ?? [])];
		}
	}

	$effect(() => {
		if (isCreating && browser && auth.isLoggedIn && !draftInitialized) {
			initializeDraft();
			draftInitialized = true;
			loading = false;
		}
	});

	$effect(() => {
		if (!browser || announcementId === null || isCreating) return;

		loading = true;
		error = null;

		const abortController = new AbortController();

		fetchAnnouncementById(announcementId, abortController.signal)
			.then((data) => {
				if (abortController.signal.aborted) return;
				if (data && isScheduled(data.created_at) && !auth.isLoggedIn) {
					error = 'Announcement not found.';
					loading = false;
					return;
				}
				
				announcement = data;
				loading = false;
				if (data?.title) {
					const expectedPath = `/announcements/${data.id}-${toSlug(data.title)}`;
					if (page.url.pathname !== expectedPath) {
						replaceState(expectedPath, {});
					}
				}
			})
			.catch((err) => {
				if (abortController.signal.aborted) return;
				const message = err instanceof Error ? err.message : 'Failed to load announcement';
				if (message.includes('404')) {
					error = 'Announcement not found.';
				} else if (message.includes('401') || message.includes('403')) {
					error = 'You do not have permission to view this announcement.';
				} else {
					error = 'Failed to load announcement. Please try again later.';
				}
				loading = false;
			});

		return () => {
			abortController.abort();
		};
	});

	function validateInputs(): boolean {
		const hasEmptyTitle = !titleInput.trim();
		const hasEmptyContent = !contentInput.trim();
		const hasInvalidAttachments = attachmentsInput.some((a) => a && !isValidUrl(a));

		if (hasEmptyTitle || hasEmptyContent || hasInvalidAttachments) {
			const issues = [
				hasEmptyTitle && 'Title',
				hasEmptyContent && 'Content',
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
		if (!validateInputs()) return;

		const payload = buildPayload();

		try {
			if (isCreating) {
				await createAnnouncement(payload);
				invalidateAnnouncements();
				goto('/announcements');
			} else if (announcementId !== null) {
				const updated = await updateAnnouncement(announcementId, payload);
				announcement = updated;
				invalidateAnnouncements();
				isEditing = false;
				isPreviewing = false;
			}
		} catch (err) {
			if (err instanceof Error && err.message === 'Unauthenticated') {
				auth.requestLoginModal();
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

		try {
			await deleteAnnouncement(announcementId);
			showDeleteConfirm = false;
			await tick();
			invalidateAnnouncements();
			await goto('/announcements');
		} catch (err) {
			if (err instanceof Error && err.message === 'Unauthenticated') {
				showDeleteConfirm = false;
				auth.requestLoginModal();
				return;
			}
			alert(err instanceof Error ? err.message : 'Failed to delete announcement');
			showDeleteConfirm = false;
		}
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
			archivedAtInput = formatDateTimeLocal(new Date());
		}
	}

	function handleBeforeUnload(e: BeforeUnloadEvent) {
		if (isEditing || isCreating) {
			e.preventDefault();
			e.returnValue = '';
		}
	}
</script>

<svelte:window onbeforeunload={handleBeforeUnload} />

<DeleteConfirmDialog
	bind:open={showDeleteConfirm}
	onConfirm={confirmDelete}
	onCancel={cancelDelete}
/>

<main class="wrapper" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	{#if isInvalidSlug}
		<p class="error-state">Announcement not found.</p>
	{:else if loading && !isCreating}
		<p class="loading-state">Loading...</p>
	{:else if error && !isCreating}
		<p class="error-state">{error}</p>
	{:else if announcement || isCreating}
		<article class="card">
			<Content
				{announcement}
				{isEditing}
				{isCreating}
				{isPreviewing}
				bind:titleInput
				bind:contentInput
				bind:authorInput
				bind:createdAtInput
				bind:archivedAtInput
				bind:tagsInput
				bind:attachmentsInput
				{onEdit}
				{onCancel}
				{onSave}
				{onDelete}
				{onTogglePreview}
				{onToggleArchive}
			/>
		</article>
	{:else}
		<p class="error-state">Announcement not found.</p>
	{/if}
</main>

<style>
	.wrapper {
		width: min(90%, 80rem);
		margin-inline: auto;
		padding-block: 2rem;
	}

	.error-state,
	.loading-state {
		text-align: center;
		color: var(--text-four);
		padding: 4rem 1rem;
	}

	.card {
		background-color: var(--surface-eight);
		padding: 2rem;
		border-radius: 1rem;
		margin-bottom: 3rem;
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
	}
</style>
