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

	type Props = {
		id: string;
		allAnnouncements: Announcement[];
	};

	let { id, allAnnouncements }: Props = $props();

	let isCreating = $derived(id === 'create');

	let announcementId = $derived.by(() => {
		if (isCreating) return null;
		const idPart = id.split('-')[0];
		const parsed = parseInt(idPart, 10);
		return isNaN(parsed) ? null : parsed;
	});

	let announcement = $derived.by(() => {
		if (isCreating || announcementId === null) return null;
		return allAnnouncements.find((a) => a.id === announcementId) ?? null;
	});

	let error = $derived.by(() => {
		if (isCreating) return null;
		if (announcementId === null) return 'Announcement not found.';
		if (!announcement) return 'Announcement not found.';
		if (isScheduled(announcement.created_at) && !auth.isLoggedIn) return 'Announcement not found.';
		return null;
	});

	let isEditing = $state(false);
	let isPreviewing = $state(false);
	let showDeleteConfirm = $state(false);

	let titleInput = $state('');
	let contentInput = $state('');
	let authorInput = $state('');
	let createdAtInput = $state('');
	let archivedAtInput = $state('');
	let tagsInput = $state<string[]>([]);
	let draftInitialized = $state(false);

	// Correct URL slug
	$effect(() => {
		if (!browser || !announcement?.title) return;
		const expectedQuery = `?id=${announcement.id}-${toSlug(announcement.title)}`;
		untrack(() => {
			if (page.url.search !== expectedQuery) {
				replaceState(`/announcements${expectedQuery}`, {});
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
		if (isEditing || (isCreating && (titleInput.trim() || contentInput.trim() || authorInput.trim()))) {
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

<main class="detail-wrapper" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	{#if error}
		<p class="error-state">{error}</p>
	{:else if announcement || isCreating}
		<article class="card">
			<Content
				{announcement}
				{allAnnouncements}
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
	.detail-wrapper {
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
		.detail-wrapper {
			padding-block: 1rem;
		}

		.card {
			background-color: transparent;
			padding: 0;
			border-radius: 0;
		}
	}
</style>
