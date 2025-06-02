<script lang="ts">
	import { useQueryClient, type CreateQueryResult } from '@tanstack/svelte-query';
	import { admin, queries } from '$data/api';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Dialogue from '$lib/components/Dialogue.svelte';
	import type { Announcement, ResponseAnnouncement } from '$lib/types';
	import moment from 'moment';
	import { isValidUrl } from '$util/isValidUrl';

	import Delete from 'svelte-material-icons/DeleteOutline.svelte';
	import Edit from 'svelte-material-icons/PencilOutline.svelte';
	import Archive from 'svelte-material-icons/ArchiveArrowDownOutline.svelte';
	import Close from 'svelte-material-icons/Close.svelte';
	import Check from 'svelte-material-icons/Check.svelte';
	import Show from 'svelte-material-icons/EyeOutline.svelte';
	import Hide from 'svelte-material-icons/EyeOffOutline.svelte';
	import Unarchive from 'svelte-material-icons/ArchiveArrowUpOutline.svelte';

	export let isEditing: boolean;
	export let isCreating: boolean;
	export let isPreviewing: boolean;
	export let archivedAtInput: string | undefined;
	export let showDeleteConfirm: boolean;
	export let announcementIdNumber: number | undefined;
	export let draftInputs: Announcement;
	export let query: CreateQueryResult<{ announcement: ResponseAnnouncement }, unknown> | undefined;

	const client = useQueryClient();

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
			return false;
		}

		return true;
	};

	const sanitize = (draftInputs: Announcement) => {
		return {
			...draftInputs,
			content: draftInputs.content?.trim() || undefined,
			tags: draftInputs.tags && draftInputs.tags.length > 0 ? draftInputs.tags : undefined,
			archived_at: draftInputs.archived_at?.trim() || undefined,
			attachments:
				draftInputs.attachments && draftInputs.attachments?.length > 0
					? draftInputs.attachments
					: undefined,
			author: draftInputs.author?.trim() || undefined,
			level: draftInputs.level ?? undefined
		};
	};

	const save = async () => {
		if (!isValid()) return;

		await admin.update_announcement(announcementIdNumber!, sanitize(draftInputs));
		await $query?.refetch();

		isEditing = false;
	};

	const createAnnouncement = async () => {
		if (!isValid()) return;

		await admin.create_announcement(sanitize(draftInputs));
		await client.invalidateQueries(queries['announcements']());
		goto('/announcements', { invalidateAll: true });
	};

	const deleteAnnouncement = async () => {
		admin.delete_announcement(announcementIdNumber!);
		await client.invalidateQueries(queries['announcements']());
		goto('/announcements', { invalidateAll: true });
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
			icon={isPreviewing ? Hide : Show}
			iconColor="var(--secondary)"
			on:click={() => (isPreviewing = !isPreviewing)}
		/>
		<Button
			icon={archivedAtInput ? Unarchive : Archive}
			iconColor="var(--secondary)"
			on:click={toggleArchived}
		/>
		{#if isEditing}
			<Button
				icon={Close}
				iconColor="var(--secondary)"
				on:click={() => {
					isPreviewing = false;
					isEditing = false;
				}}
			/>
		{/if}
		<Button
			icon={Check}
			iconColor="var(--secondary)"
			on:click={isEditing ? save : createAnnouncement}
		/>
	{:else}
		<Button
			icon={Delete}
			iconColor="var(--secondary)"
			on:click={() => (showDeleteConfirm = !showDeleteConfirm)}
		/>
		<Button icon={Edit} iconColor="var(--secondary)" on:click={() => (isEditing = !isEditing)} />
	{/if}
</div>

<style>
	div {
		display: flex;
		gap: 1rem;
		color: var(--secondary);
	}
</style>
