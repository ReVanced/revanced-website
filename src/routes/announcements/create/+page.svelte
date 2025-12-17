<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { createAnnouncement, type AnnouncementInput } from '$lib/api/client';
	import { auth, announcementsQuery } from '$stores';
	import { parseAttachmentUrls } from '$lib/utils/url';
	import Button from '$components/atoms/Button.svelte';
	import IconSave from 'virtual:icons/material-symbols/check';
	import IconCancel from 'virtual:icons/material-symbols/close';

	let title = $state('');
	let content = $state('');
	let tags = $state('');
	let level = $state(0);
	let attachments = $state('');
	let saving = $state(false);
	let isPreviewing = $state(false);

	let isAdmin = $derived(auth.isLoggedIn);

	let hasContent = $derived(
		title.trim().length > 0 ||
		content.trim().length > 0 ||
		tags.trim().length > 0 ||
		attachments.trim().length > 0
	);

	$effect(() => {
		if (browser && !auth.isLoggedIn) {
			goto('/announcements');
		}
	});

	onMount(() => {
		function handleBeforeUnload(e: BeforeUnloadEvent) {
			if (hasContent) {
				e.preventDefault();
				e.returnValue = '';
			}
		}

		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	});

	function togglePreview() {
		isPreviewing = !isPreviewing;
	}

	async function handleCreate() {
		if (!title.trim()) {
			alert('Title is required');
			return;
		}

		const attachmentUrls = parseAttachmentUrls(attachments);
		const rawLines = attachments.split('\n').filter((l) => l.trim());
		const invalidCount = rawLines.length - attachmentUrls.length;

		if (invalidCount > 0) {
			alert(`${invalidCount} attachment URL(s) are invalid and will be ignored`);
		}

		saving = true;

		try {
			const input: AnnouncementInput = {
				title: title.trim(),
				content: content.trim() || undefined,
				tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
				level: level,
				attachments: attachmentUrls.length > 0 ? attachmentUrls : undefined
			};

			await createAnnouncement(input);
			announcementsQuery.refetch();
			goto('/announcements');
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Failed to create announcement');
		} finally {
			saving = false;
		}
	}

	function handleCancel() {
		if (hasContent) {
			if (!confirm('You have unsaved changes. Are you sure you want to leave?')) {
				return;
			}
		}
		goto('/announcements');
	}
</script>

<svelte:head>
	<title>Create Announcement - ReVanced</title>
</svelte:head>

{#if isAdmin}
	<main class="wrapper" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
		<article class="card">
			<header class="header">
				<h1 class="page-title">Create Announcement</h1>
				<div class="admin-buttons">
					<Button icon={IconCancel} buttonStyle="icon" onclick={handleCancel} disabled={saving} />
					<Button icon={IconSave} buttonStyle="icon" onclick={handleCreate} disabled={saving} />
				</div>
			</header>

			<hr class="divider" />

			<div class="form">
				<div class="field">
					<label for="title">Title</label>
					<input
						id="title"
						type="text"
						bind:value={title}
						placeholder="Announcement title"
					/>
				</div>

				<div class="field-row">
					<div class="field">
						<label for="tags">Tags</label>
						<input
							id="tags"
							type="text"
							bind:value={tags}
							placeholder="Tags (comma separated)"
						/>
					</div>

					<div class="field field-level">
						<label for="level">Level</label>
						<select id="level" bind:value={level}>
							<option value={0}>Info (0)</option>
							<option value={1}>Warning (1)</option>
							<option value={2}>Severe (2)</option>
						</select>
					</div>
				</div>

				<div class="field">
					<div class="field-header">
						<label for="content">Content</label>
						<button type="button" class="preview-toggle" onclick={togglePreview}>
							{isPreviewing ? 'Hide Preview' : 'Show Preview'}
						</button>
					</div>
					<textarea
						id="content"
						bind:value={content}
						placeholder="Content (HTML supported)"
						rows="12"
					></textarea>
					{#if isPreviewing && content}
						<div class="preview-pane">
							<div class="preview-label">Preview</div>
							<div class="preview-content">
								{@html content}
							</div>
						</div>
					{/if}
				</div>

				<div class="field">
					<label for="attachments">Attachment URLs (one per line)</label>
					<textarea
						id="attachments"
						bind:value={attachments}
						placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.png"
						rows="4"
						class="attachments-textarea"
					></textarea>
				</div>
			</div>

			<hr class="divider" />

			<div class="actions">
				<Button onclick={handleCancel} disabled={saving}>Cancel</Button>
				<Button onclick={handleCreate} disabled={saving}>
					{saving ? 'Creating...' : 'Create Announcement'}
				</Button>
			</div>
		</article>
	</main>
{:else}
	<main class="wrapper">
		<div class="error-state">
			<p>You must be logged in to create announcements.</p>
			<a href="/announcements">← Back to announcements</a>
		</div>
	</main>
{/if}

<style>
	.wrapper {
		width: min(90%, 60rem);
		margin-inline: auto;
		padding-block: 2rem;
	}

	.card {
		background-color: var(--surface-eight);
		padding: 2rem;
		border-radius: 1rem;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.page-title {
		margin: 0;
		font-size: 1.5rem;
		color: var(--text-one);
	}

	.admin-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.divider {
		border: none;
		border-top: 1px solid var(--surface-six);
		margin: 1.5rem 0;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.field label {
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text-four);
	}

	.field input,
	.field textarea {
		font-size: 1rem;
		color: var(--text-one);
		background: var(--surface-four);
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		padding: 0.75rem;
		width: 100%;
	}

	.field input:focus,
	.field textarea:focus {
		outline: none;
		border-color: var(--primary);
	}

	.field textarea {
		min-height: 200px;
		font-family: monospace;
		resize: vertical;
	}

	.field-row {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.field-row .field {
		flex: 1;
		min-width: 200px;
	}

	.field-level {
		max-width: 180px;
	}

	.field select {
		font-size: 1rem;
		color: var(--text-one);
		background: var(--surface-four);
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		padding: 0.75rem;
		width: 100%;
	}

	.field select:focus {
		outline: none;
		border-color: var(--primary);
	}

	.field-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.preview-toggle {
		font-size: 0.85rem;
		color: var(--primary);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
	}

	.preview-toggle:hover {
		background: var(--surface-four);
	}

	.preview-pane {
		margin-top: 0.75rem;
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

	.attachments-textarea {
		min-height: 80px;
	}

	.actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.error-state {
		text-align: center;
		padding: 3rem 1rem;
		color: var(--text-four);
	}

	.error-state a {
		display: inline-block;
		margin-top: 1.5rem;
		color: var(--primary);
		font-weight: 500;
		text-decoration: none;
	}

	.error-state a:hover {
		text-decoration: underline;
		color: var(--text-one);
	}

	@media (max-width: 768px) {
		.wrapper {
			padding-block: 1rem;
		}

		.card {
			background-color: transparent;
			padding: 0;
		}

		.page-title {
			font-size: 1.25rem;
		}
	}
</style>
