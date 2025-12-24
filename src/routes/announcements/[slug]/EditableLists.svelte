<script lang="ts">
	import TagChip from '$components/atoms/TagChip.svelte';
	import Gallery from '$components/molecules/Gallery.svelte';
	import { announcementTagsQuery } from '$stores';
	import { isValidUrl } from '$lib/utils/url';
	import IconAdd from 'svelte-material-icons/Plus.svelte';
	import IconDelete from 'svelte-material-icons/DeleteOutline.svelte';

	type Props = {
		field: 'tags' | 'attachments';
		isEditing: boolean;
		isPreviewing: boolean;
		tagsInput?: string[];
		attachments?: string[];
		attachmentsInput?: string[];
	};

	let {
		field,
		isEditing,
		isPreviewing,
		tagsInput = $bindable([]),
		attachments = [],
		attachmentsInput = $bindable([])
	}: Props = $props();

	let newTag = $state('');
	let availableTags = $derived.by(() => {
		const apiTags = (announcementTagsQuery.data ?? []).map(t => t.name);
		const customTags = (tagsInput ?? []).filter(t => !apiTags.includes(t));
		return [...apiTags, ...customTags];
	});

	let newAttachment = $state('');
	let displayAttachments = $derived(isPreviewing ? attachmentsInput : attachments);

	function handleTagClick(tag: string) {
		if (tagsInput?.includes(tag)) {
			tagsInput = tagsInput.filter(t => t !== tag);
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

	function addAttachment() {
		const trimmed = newAttachment.trim();
		if (!trimmed || !isValidUrl(trimmed)) return;
		
		attachmentsInput = [...(attachmentsInput ?? []), trimmed];
		newAttachment = '';
	}

	function removeAttachment(index: number) {
		attachmentsInput = attachmentsInput.filter((_, i) => i !== index);
	}

	function handleAttachmentKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			addAttachment();
		}
	}
</script>

{#if field === 'tags'}
	{#if isEditing && !isPreviewing}
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
	{/if}
{:else if field === 'attachments'}
	{#if isEditing && !isPreviewing}
		<div class="attachments-editor">
			{#if attachmentsInput && attachmentsInput.length > 0}
				{#each attachmentsInput as attachment, index}
					<div class="attachment-row">
						<input
							type="text"
							bind:value={attachmentsInput[index]}
							class="attachment-input"
							class:invalid={!isValidUrl(attachment)}
							placeholder="Attachment URL"
						/>
						<button
							type="button"
							class="remove-btn"
							onclick={() => removeAttachment(index)}
							aria-label="Remove attachment"
						>
							<IconDelete size={20} />
						</button>
					</div>
				{/each}
			{/if}
			<div class="new-attachment">
				<input
					type="text"
					bind:value={newAttachment}
					class="attachment-input new"
					class:invalid={newAttachment.trim() !== '' && !isValidUrl(newAttachment)}
					placeholder="Add attachment URL"
					onkeydown={handleAttachmentKeydown}
					onblur={addAttachment}
				/>
				<span class="add-icon">
					<IconAdd size={18} />
				</span>
			</div>
		</div>
	{:else if displayAttachments && displayAttachments.length > 0}
		<Gallery images={displayAttachments} columns={3} gap="0.75rem" />
	{/if}
{/if}

<style>
	.tags-editor {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 4px;
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

	.attachments-editor {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
	}

	.attachment-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		position: relative;
	}

	.attachment-input {
		flex: 1;
		padding: 0.75rem 2.5rem 0.75rem 0.75rem;
		border: 1px solid var(--border);
		border-radius: 8px;
		background-color: transparent;
		color: var(--text-one);
		font-size: 0.85rem;
		font-family: inherit;
		letter-spacing: 0.02rem;
		transition: border-color 0.2s var(--bezier-one);
	}

	.attachment-input:focus {
		outline: none;
		border-color: var(--primary);
	}

	.attachment-input.invalid {
		border-color: var(--red-one);
	}

	.attachment-input::placeholder {
		color: var(--text-four);
		opacity: 0.6;
	}

	.remove-btn {
		position: absolute;
		right: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 4px;
		background: transparent;
		border: none;
		cursor: pointer;
		color: var(--text-four);
		transition: color 0.2s var(--bezier-one);
	}

	.remove-btn:hover {
		color: var(--red-one);
	}

	.remove-btn :global(svg) {
		width: 20px;
		height: 20px;
	}

	.new-attachment {
		display: inline-flex;
		align-items: center;
		position: relative;
	}

	.new-attachment .attachment-input.new {
		width: 52px;
		flex: none;
		padding: 0.75rem;
		padding-right: 0;
		border: 1px solid var(--border);
		transition: all 0.2s var(--bezier-one);
		cursor: pointer;
	}

	.new-attachment .attachment-input.new::placeholder {
		color: transparent;
		transition: color 0.2s var(--bezier-one);
	}

	.new-attachment .attachment-input.new:focus {
		width: 100%;
		padding-right: 0.75rem;
		cursor: text;
	}

	.new-attachment .attachment-input.new:focus::placeholder {
		color: var(--text-four);
		opacity: 0.6;
	}

	.new-attachment .attachment-input.new:focus + .add-icon {
		opacity: 0;
		pointer-events: none;
	}

	.new-attachment .attachment-input.new.invalid {
		border-color: var(--red-one);
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

	.new-attachment .add-icon {
		left: 26px;
	}

	.add-icon :global(svg) {
		width: 20px;
		height: 20px;
	}
</style>
