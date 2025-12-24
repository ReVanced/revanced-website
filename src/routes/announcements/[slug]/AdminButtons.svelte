<script lang="ts">
	import Button from '$components/atoms/Button.svelte';
	import IconDelete from 'virtual:icons/material-symbols/delete-outline';
	import IconEdit from 'virtual:icons/material-symbols/edit-outline';
	import IconArchive from 'virtual:icons/material-symbols/inventory-2-outline';
	import IconUnarchive from 'virtual:icons/material-symbols/unarchive-outline';
	import IconClose from 'virtual:icons/material-symbols/close';
	import IconCheck from 'virtual:icons/material-symbols/check';
	import IconPreview from 'virtual:icons/material-symbols/visibility-outline';
	import IconPreviewOff from 'virtual:icons/material-symbols/visibility-off-outline';

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
