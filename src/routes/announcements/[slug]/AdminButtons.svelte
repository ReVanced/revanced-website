<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	export let isEditing: boolean,
		isCreating: boolean,
		isPreviewing: boolean,
		archivedAtElement: string | null,
		showDeleteConfirm: boolean,
		createAnnouncement: () => void,
		save: () => void;

	const toggleArchived = () => {
		if (archivedAtElement) archivedAtElement = null;
		else archivedAtElement = new Date().toISOString().split('.')[0].slice(0, -3);
	};
</script>

<div>
	{#if isEditing || isCreating}
		<Button
			type="icon"
			icon={isPreviewing ? 'hide' : 'show'}
			on:click={() => (isPreviewing = !isPreviewing)}
		/>
		<Button
			type="icon"
			icon={archivedAtElement ? 'unarchive' : 'archive'}
			on:click={toggleArchived}
		/>
		{#if isEditing}
			<Button type="icon" icon="close" on:click={() => (isEditing = false)} />
		{/if}
		<Button type="icon" icon="check" on:click={isEditing ? save : createAnnouncement} />
	{:else}
		<Button type="icon" icon="delete" on:click={() => (showDeleteConfirm = !showDeleteConfirm)} />
		<Button type="icon" icon="edit" on:click={() => (isEditing = !isEditing)} />
	{/if}
</div>

<style>
	div {
		display: flex;
		gap: 1rem;
	}
</style>
