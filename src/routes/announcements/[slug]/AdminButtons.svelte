<script lang="ts">
	import { goto } from '$app/navigation';
	import { admin } from '$data/api';
	import Button from '$lib/components/Button.svelte';
	import Dialogue from '$lib/components/Dialogue.svelte';

	export let isEditing: boolean,
		isCreating: boolean,
		isPreviewing: boolean,
		archivedAtElement: string | null,
		showDeleteConfirm: boolean,
		announcementIdNumber,
		draftElements,
		query;

	const toggleArchived = () => {
		if (archivedAtElement) archivedAtElement = null;
		else archivedAtElement = new Date().toISOString().split('.')[0].slice(0, -3);
	};

	const save = async () => {
		await admin.update_announcement(announcementIdNumber!, draftElements);
		await $query.refetch();

		isEditing = false;
	};

	const createAnnouncement = async () => {
		await admin.create_announcement(draftElements);
		history.back();
	};

	const deleteAnnouncement = async () => {
		await admin.delete_announcement(announcementIdNumber!);
		goto('/announcements');
	};

	const handleUnload = (e: BeforeUnloadEvent) => {
		if (isEditing) {
			e.preventDefault();
			e.returnValue = '';
		}
	};
</script>

<svelte:window on:beforeunload={handleUnload} />

<Dialogue bind:modalOpen={showDeleteConfirm}>
	<svelte:fragment slot="title">Confirm?</svelte:fragment>
	<svelte:fragment slot="description">Do you want to delete this announcement?</svelte:fragment>
	<svelte:fragment slot="buttons">
		<Button type="text" on:click={() => (showDeleteConfirm = !showDeleteConfirm)}>Cancel</Button>
		<Button type="filled" on:click={deleteAnnouncement}>OK</Button>
	</svelte:fragment>
</Dialogue>

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
