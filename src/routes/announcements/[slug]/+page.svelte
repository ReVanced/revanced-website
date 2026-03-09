<script lang="ts">
	import { tick, untrack } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { goto, replaceState, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import type { Announcement } from '$lib/api/types';
	import { formatUTC, formatDateTimeLocal } from '$lib/utils/relativeTime';
	import { toSlug, isScheduled } from '$lib/utils';
	import {
		createAnnouncement,
		updateAnnouncement,
		deleteAnnouncement,
		type AnnouncementPayload
	} from '$lib/api/client';
	import { auth } from '$stores';
	import Content from './Content.svelte';
	import DeleteConfirmDialog from './DeleteConfirmDialog.svelte';

	let { data } = $props();

	let announcement = $state<Announcement | null>(null);
	let error = $state<string | null>(null);

	let isEditing = $state(false);
	let isPreviewing = $state(false);
	let showDeleteConfirm = $state(false);

	let isCreating = $derived(data.isCreating);

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
	let draftInitialized = $state(false);

	// Initialize from server data
	$effect(() => {
		if (data.announcement) {
			announcement = data.announcement;
			if (isScheduled(data.announcement.created_at) && !auth.isLoggedIn) {
				error = 'Announcement not found.';
			} else {
				error = null;
			}
		} else if (!isCreating) {
			error = 'Announcement not found.';
		}
	});

	// Correct URL slug without creating a reactive loop
	$effect(() => {
		if (!browser || !data.announcement?.title) return;
		const { id, title } = data.announcement;
		const expectedPath = `/announcements/${id}-${toSlug(title)}`;
		untrack(() => {
			if (page.url.pathname !== expectedPath) {
				replaceState(expectedPath, {});
			}
		});
	});

	function initializeDraft() {
		if (isCreating) {
			titleInput = '';
			contentInput = '';
			authorInput = '';
			createdAtInput = formatDateTimeLocal(new Date());
			archivedAtInput = '';
			tagsInput = [];
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
		}
	}

	$effect(() => {
		if (isCreating && browser && auth.isLoggedIn && !draftInitialized) {
			initializeDraft();
			draftInitialized = true;
		}
	});

	function validateInputs(): boolean {
		const hasEmptyTitle = !titleInput.trim();
		const hasEmptyContent = !contentInput.trim();

		if (hasEmptyTitle || hasEmptyContent) {
			const issues = [
				hasEmptyTitle && 'Title',
				hasEmptyContent && 'Content'
			].filter(Boolean);
			alert(`${issues.join(' and ')} must be filled properly`);
			return false;
		}
		return true;
	}

	function buildPayload(): AnnouncementPayload {
		const archivedAtFormatted = archivedAtInput ? formatUTC(archivedAtInput) : null;
		const createdAtFormatted = createdAtInput ? String(formatUTC(createdAtInput)) : undefined;
		
		return {
			title: titleInput.trim(),
			content: contentInput.trim() || undefined,
			author: authorInput.trim() || undefined,
			tags: tagsInput.length > 0 ? tagsInput : undefined,
			created_at: createdAtFormatted,
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
				await invalidateAll();
				goto('/announcements');
			} else if (announcementId !== null) {
				const updated = await updateAnnouncement(announcementId, payload);
				announcement = updated;
				await invalidateAll();
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
			await invalidateAll();
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
	{:else if error && !isCreating}
		<p class="error-state">{error}</p>
	{:else if announcement || isCreating}
		<article class="card">
			<Content
				{announcement}
				allAnnouncements={data.announcements ?? []}
				{isEditing}
				{isCreating}
				{isPreviewing}
				bind:titleInput
				bind:contentInput
				bind:authorInput
				bind:createdAtInput
				bind:archivedAtInput
				bind:tagsInput
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

	.error-state {
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
