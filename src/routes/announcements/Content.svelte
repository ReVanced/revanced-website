<script lang="ts">
	import { relativeTime } from '$lib/utils/relativeTime';
	import { auth } from '$stores';
	import TagChip from '$components/atoms/TagChip.svelte';
	import AdminButtons from './AdminButtons.svelte';
	import IconArrowRight from 'svelte-material-icons/ArrowRight.svelte';
	import IconAdd from 'svelte-material-icons/Plus.svelte';
	import moment from 'moment';

	import type { Announcement } from '$lib/api/types';

	type Props = {
		announcement: Announcement | null;
		allAnnouncements: Announcement[];
		isEditing: boolean;
		isCreating: boolean;
		isPreviewing: boolean;
		titleInput: string;
		contentInput: string;
		authorInput: string;
		createdAtInput: string;
		archivedAtInput: string;
		tagsInput: string[];
		onEdit: () => void;
		onCancel: () => void;
		onSave: () => void;
		onDelete: () => void;
		onTogglePreview: () => void;
		onToggleArchive: () => void;
	};

	let {
		announcement,
		allAnnouncements = [],
		isEditing,
		isCreating,
		isPreviewing,
		titleInput = $bindable(''),
		contentInput = $bindable(''),
		authorInput = $bindable(''),
		createdAtInput = $bindable(''),
		archivedAtInput = $bindable(''),
		tagsInput = $bindable([]),
		onEdit,
		onCancel,
		onSave,
		onDelete,
		onTogglePreview,
		onToggleArchive
	}: Props = $props();

	let isEditMode = $derived(isEditing || isCreating);

	// Derived display values
	let displayTitle = $derived(isPreviewing ? titleInput : announcement?.title ?? '');
	let displayContent = $derived(isPreviewing ? contentInput : announcement?.content ?? '');
	let displayAuthor = $derived(isPreviewing ? authorInput : announcement?.author ?? null);
	let displayCreatedAt = $derived(isPreviewing ? createdAtInput : announcement?.created_at ?? '');
	let displayArchivedAt = $derived.by(() => {
		const date = isPreviewing ? archivedAtInput : announcement?.archived_at;
		return date && moment(date).isBefore() ? date : null;
	});

	// Tags - derive available tags from all announcements
	let newTag = $state('');
	let availableTags = $derived.by(() => {
		const existingTags = [...new Set(allAnnouncements.flatMap((a) => a.tags ?? []))];
		const customTags = (tagsInput ?? []).filter((t) => !existingTags.includes(t));
		return [...existingTags, ...customTags];
	});

	function handleTagClick(tag: string) {
		if (tagsInput?.includes(tag)) {
			tagsInput = tagsInput.filter((t) => t !== tag);
		} else {
			tagsInput = [...(tagsInput ?? []), tag];
		}
	}

	function handleAddTag() {
		const trimmed = newTag.trim();
		if (!trimmed) return;

		if (!availableTags.includes(trimmed)) {
			tagsInput = [...(tagsInput ?? []), trimmed];
		} else if (!tagsInput?.includes(trimmed)) {
			tagsInput = [...(tagsInput ?? []), trimmed];
		}
		newTag = '';
	}

	function handleTagKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleAddTag();
		}
	}
</script>

<header class="header">
	<div class="header-content">
		<!-- Title -->
		<h1 class="title">
			{#if isEditMode && !isPreviewing}
				<input
					type="text"
					bind:value={titleInput}
					class="title-input"
					class:empty={!titleInput?.trim()}
					placeholder="Enter title"
				/>
			{:else}
				<span class="title-text">{displayTitle}</span>
			{/if}
		</h1>

		<!-- Meta (date + author) -->
		<h4 class="meta">
			{#if isEditMode && !isPreviewing}
				<span class="date-inputs">
					<input
						type="datetime-local"
						max="9999-12-31T23:59"
						bind:value={createdAtInput}
						class="date-input"
					/>
					{#if archivedAtInput}
						<IconArrowRight size={16} />
						<input
							type="datetime-local"
							max="9999-12-31T23:59"
							bind:value={archivedAtInput}
							class="date-input"
						/>
					{/if}
				</span>
				·
				<input
					type="text"
					bind:value={authorInput}
					class="author-input"
					placeholder="Enter author name"
				/>
			{:else}
				<span class="date-display">
					{relativeTime(displayCreatedAt)}
					{#if displayArchivedAt}
						<IconArrowRight size={16} />
						{relativeTime(displayArchivedAt)}
					{/if}
				</span>
				{#if displayAuthor}
					·
					<span>{displayAuthor}</span>
				{/if}
			{/if}
		</h4>
		<!-- Tags -->
		{#if isEditMode && !isPreviewing}
			<div class="tags-editor">
				{#each availableTags as tag}
					<TagChip
						{tag}
						selected={tagsInput?.includes(tag) ?? false}
						clickable={true}
						onclick={() => handleTagClick(tag)}
					/>
				{/each}
				<div class="new-tag">
					<input
						type="text"
						bind:value={newTag}
						class="tag-input"
						placeholder="Add tag"
						onkeydown={handleTagKeydown}
						onblur={handleAddTag}
					/>
					<span class="add-icon">
						<IconAdd size={18} />
					</span>
				</div>
			</div>
		{:else if (isPreviewing ? tagsInput : announcement?.tags ?? []).length > 0}
			<div class="tags-editor">
				{#each (isPreviewing ? tagsInput : announcement?.tags ?? []) as tag}
					<TagChip {tag} />
				{/each}
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

<!-- Content -->
{#if isEditMode && !isPreviewing}
	<textarea
		bind:value={contentInput}
		class="content-input"
		placeholder="Enter content (supports HTML)"
		rows="8"
	></textarea>
{:else if displayContent}
	<div class="content-display">
		{@html displayContent}
	</div>
{/if}

<style>
	/* Header layout */
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
	}

	/* Title */
	.title {
		margin: 0;
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--text-one);
	}

	.title-input {
		width: 100%;
		padding: 0;
		border: none;
		outline: none;
		background-color: transparent;
		color: var(--text-one);
		font-size: 2.5rem;
		font-weight: 700;
		line-height: 4rem;
		letter-spacing: -0.025em;
		font-family: inherit;
	}

	.title-text {
		font-size: 2.5rem;
	}

	/* Meta */
	.meta {
		display: inline-flex;
		align-items: center;
		flex-wrap: wrap;
		column-gap: 0.5rem;
		margin: 0;
		font-weight: normal;
		font-size: 1rem;
		color: var(--secondary);
	}

	.author-input {
		padding: 0;
		border: none;
		outline: none;
		background-color: transparent;
		color: var(--secondary);
		font-size: 1rem;
		font-family: inherit;
		letter-spacing: 0.02rem;
	}

	.date-inputs,
	.date-display {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		column-gap: 0.5rem;
	}

	.date-input {
		padding: 0;
		border: none;
		outline: none;
		background-color: transparent;
		color: var(--secondary);
		font-size: 1rem;
		font-family: inherit;
		letter-spacing: 0.02rem;
	}

	.date-input::-webkit-calendar-picker-indicator {
		filter: invert(88%) sepia(60%) saturate(4731%) hue-rotate(173deg) brightness(91%) contrast(111%);
	}

	.date-display :global(svg),
	.date-inputs :global(svg) {
		width: 20px;
		height: 20px;
		color: var(--text-four);
	}

	/* Divider */
	.divider {
		border: none;
		height: 8px;
		width: 100%;
		background-image: url("data:image/svg+xml,%3Csvg width='91' height='8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M114 4c-5.067 4.667-10.133 4.667-15.2 0S88.667-.667 83.6 4 73.467 8.667 68.4 4 58.267-.667 53.2 4 43.067 8.667 38 4 27.867-.667 22.8 4 12.667 8.667 7.6 4-2.533-.667-7.6 4s-10.133 4.667-15.2 0S-32.933-.667-38 4s-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0' stroke='%23465969' stroke-linecap='square'/%3E%3C/svg%3E");
		background-repeat: repeat-x;
		margin: 1.5rem 0;
	}

	/* Content */
	.content-input {
		width: 100%;
		padding: 0;
		border: none;
		outline: none;
		background-color: transparent;
		color: var(--secondary);
		font-size: 1rem;
		font-family: inherit;
		letter-spacing: 0.02rem;
		resize: vertical;
		min-height: 150px;
	}

	.content-display {
		color: var(--text-four);
		font-size: 1rem;
		line-height: 1.7;
	}

	.content-display :global(a) {
		color: var(--primary);
		font-weight: 600;
		font-size: 0.95rem;
		text-decoration: none;
	}

	.content-display :global(a:hover) {
		text-decoration: underline var(--secondary);
		color: var(--text-one);
	}

	.content-display :global(h2),
	.content-display :global(h3),
	.content-display :global(h4),
	.content-display :global(h5),
	.content-display :global(h6) {
		color: var(--secondary);
		margin-top: 1.25rem;
		margin-bottom: 1.25rem;
	}

	.content-display :global(h1) { font-size: 1.8rem; }
	.content-display :global(h2) { font-size: 1.6rem; }
	.content-display :global(h3) { font-size: 1.4rem; }
	.content-display :global(h4) { font-size: 1.2rem; }
	.content-display :global(h5) { font-size: 1.1rem; }
	.content-display :global(h6) { font-size: 1rem; }

	.content-display :global(ul),
	.content-display :global(ol) {
		padding-left: 1.5rem;
	}

	.content-display :global(li) {
		list-style-position: inside;
		margin-bottom: 0.5rem;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.content-display :global(p) {
		margin-bottom: 1rem;
	}

	.content-display :global(code) {
		background-color: var(--surface-four);
		padding: 0.2em 0.4em;
		border-radius: 4px;
		font-size: 0.9em;
	}

	.content-display :global(pre) {
		background-color: var(--surface-four);
		padding: 1rem;
		border-radius: 8px;
		overflow-x: auto;
	}

	.content-display :global(pre code) {
		background: none;
		padding: 0;
	}

	/* Tags */
	.tags-editor {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 4px;
		margin-top: 0.5rem;
	}

	.new-tag {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.tag-input {
		height: 32px;
		width: 32px;
		padding: 0 8px;
		border: none;
		outline: none;
		border-radius: 8px;
		background-color: var(--tertiary);
		color: var(--text-four);
		font-size: 0.85rem;
		font-family: inherit;
		letter-spacing: 0.02rem;
		transition: width 0.2s var(--bezier-one);
		cursor: pointer;
	}

	.tag-input::placeholder {
		color: transparent;
		transition: color 0.2s var(--bezier-one);
	}

	.tag-input:focus {
		width: 120px;
		cursor: text;
	}

	.tag-input:focus::placeholder {
		color: var(--text-four);
		opacity: 0.6;
	}

	.tag-input:focus + .add-icon {
		opacity: 0;
		pointer-events: none;
	}

	.add-icon {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
		color: var(--text-four);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: opacity 0.2s var(--bezier-one);
	}

	.add-icon :global(svg) {
		width: 20px;
		height: 20px;
	}

	@media (max-width: 768px) {
		.header-content {
			flex: 1 1 100%;
		}
	}
</style>
