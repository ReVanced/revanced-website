<script lang="ts">
	import { goto } from '$app/navigation';
	import { admin } from '$data/api';
	import Button from '$lib/components/Button.svelte';
	import Dialogue from '$lib/components/Dialogue.svelte';
	import type { Announcement } from '$lib/types';
	import moment from 'moment';
	import isValidUrl from './utils';

	export let isEditing: boolean;
	export let isCreating: boolean;
	export let isPreviewing: boolean;
	export let archivedAtInput: string | undefined;
	export let showDeleteConfirm: boolean;
	export let announcementIdNumber: number | undefined;
	export let draftInputs: Announcement;
	export let query;

	const toggleArchived = () => {
		if (archivedAtInput) archivedAtInput = undefined;
		else archivedAtInput = moment().format('YYYY-MM-DDTHH:mm');
	};

	const isValid = () => {
		const hasEmptyTitle = !draftInputs.title;
		const hasEmptyAttachments = draftInputs.attachments?.some((a) => !isValidUrl(a));

		if (hasEmptyTitle || hasEmptyAttachments) {
			alert(
				`${[hasEmptyTitle && 'Title', hasEmptyAttachments && 'Attachments']
					.filter(Boolean)
					.join(' and ')} must be filled properly`
			);
			return true;
		}

		return false;
	};

	const save = async () => {
		if (isValid()) return;

		await admin.update_announcement(announcementIdNumber!, draftInputs);
		await $query.refetch();

		isEditing = false;
	};

	const createAnnouncement = async () => {
		if (isValid()) return;

		await admin.create_announcement(draftInputs);
		goto('/announcements');
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
			icon={archivedAtInput ? 'unarchive' : 'archive'}
			on:click={toggleArchived}
		/>
		{#if isEditing}
			<Button
				type="icon"
				icon="close"
				on:click={() => {
					isPreviewing = false;
					isEditing = false;
				}}
			/>
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
