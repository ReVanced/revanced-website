<script lang="ts">
	import Button from '$components/atoms/Button.svelte';
	import IconDelete from 'svelte-material-icons/DeleteOutline.svelte';
	import IconEdit from 'svelte-material-icons/PencilOutline.svelte';
	import IconArchive from 'svelte-material-icons/ArchiveArrowDownOutline.svelte';
	import IconUnarchive from 'svelte-material-icons/ArchiveArrowUpOutline.svelte';
	import IconClose from 'svelte-material-icons/Close.svelte';
	import IconCheck from 'svelte-material-icons/Check.svelte';
	import IconPreview from 'svelte-material-icons/EyeOutline.svelte';
	import IconPreviewOff from 'svelte-material-icons/EyeOffOutline.svelte';

	type Props = {
		isEditing: boolean;
		isCreating: boolean;
		isPreviewing: boolean;
		hasArchivedAt: boolean;
		onEdit: () => void;
		onCancel: () => void;
		onSave: () => void;
		onDelete: () => void;
		onTogglePreview: () => void;
		onToggleArchive: () => void;
	};

	let {
		isEditing,
		isCreating,
		isPreviewing,
		hasArchivedAt,
		onEdit,
		onCancel,
		onSave,
		onDelete,
		onTogglePreview,
		onToggleArchive
	}: Props = $props();
</script>

<div class="admin-buttons">
	{#if isEditing || isCreating}
		<Button
			buttonStyle="icon"
			tooltip={isPreviewing ? 'Hide preview' : 'Show preview'}
			icon={isPreviewing ? IconPreviewOff : IconPreview}
			onclick={onTogglePreview}
		/>

		<Button
			buttonStyle="icon"
			tooltip={hasArchivedAt ? 'Disable archive field' : 'Enable archive field'}
			icon={hasArchivedAt ? IconUnarchive : IconArchive}
			onclick={onToggleArchive}
		/>

		{#if isEditing}
			<Button
				buttonStyle="icon"
				tooltip="Cancel editing"
				icon={IconClose}
				onclick={onCancel}
			/>
		{/if}

		<Button
			buttonStyle="icon"
			tooltip={isEditing ? 'Save changes' : 'Create announcement'}
			icon={IconCheck}
			onclick={onSave}
		/>
	{:else}
		<Button
			buttonStyle="icon"
			tooltip="Delete announcement"
			icon={IconDelete}
			onclick={onDelete}
		/>

		<Button
			buttonStyle="icon"
			tooltip="Edit announcement"
			icon={IconEdit}
			onclick={onEdit}
		/>
	{/if}
</div>

<style>
	.admin-buttons {
		display: flex;
		gap: 1rem;
		color: var(--secondary);
	}
</style>
