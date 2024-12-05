<script lang="ts">
	import { goto } from '$app/navigation';
	import { admin } from '$data/api';
	import Button from '$lib/components/Button.svelte';
	import Dialogue from '$lib/components/Dialogue.svelte';
	import { admin_login } from '$lib/stores';
	import Title from './Title.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import AdminButtons from './AdminButtons.svelte';
	import Author from './Author.svelte';
	import Date from './Date.svelte';
	import Content from './Content.svelte';
	import Attachments from './Attachments.svelte';
	import Tags from './Tags.svelte';

	export let isCreating, announcementContent, announcementIdNumber, query;

	let isPreviewing = false;
	let isEditing = false;
	let isSaved = false;
	let showDeleteConfirm = false;

	let tagsElement: string[] = announcementContent?.tags ?? [];
	let titleElement: string = announcementContent?.title ?? '';
	let authorElement: string = announcementContent?.author ?? '';
	let contentElement: string = announcementContent?.content ?? '';
	let createdAtElement: string = announcementContent?.created_at ?? '';
	let archivedAtElement: string = announcementContent?.archived_at ?? null;
	let attachmentsElement: string[] = announcementContent?.attachments ?? [];

	const addAttachment = () => {
		attachmentsElement = [...attachmentsElement, '']; // Ensure reactivity with a new array
	};

	const removeAttachment = (index) => {
		attachmentsElement = attachmentsElement.filter((_, i) => i !== index);
	};

	const save = async () => {
		const data = {
			title: titleElement,
			author: authorElement,
			content: contentElement,
			created_at: createdAtElement,
			attachments: attachmentsElement,
			tags: tagsElement
		};
		await admin.update_announcement(announcementIdNumber!, data);
		await $query.refetch();

		announcementContent.title = titleElement;
		announcementContent.author = authorElement;
		announcementContent.content = contentElement;
		announcementContent.created_at = createdAtElement;
		announcementContent.attachments = attachmentsElement;
		announcementContent.tags = tagsElement;

		isEditing = false;
		isSaved = true;
	};

	const createAnnouncement = async () => {
		const data = {
			title: titleElement,
			author: authorElement,
			content: contentElement,
			attachments: attachmentsElement,
			tags: tagsElement,
			level: 0
		};
		await admin.create_announcement(data);
		history.back();
	};

	const deleteAnnouncement = async () => {
		await admin.delete_announcement(announcementIdNumber!);
		goto('/announcements');
	};
	const handleUnload = (e: BeforeUnloadEvent) => {
		if (isEditing && !isSaved) {
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

<div class="card">
	<div class="header">
		<div class="header-data">
			<Title
				{isCreating}
				{isEditing}
				{isPreviewing}
				title={announcementContent.title}
				bind:titleElement
			/>

			<h4>
				<Date
					{isCreating}
					{isEditing}
					{isPreviewing}
					createdAt={announcementContent.created_at}
					archivedAt={announcementContent.archived_at}
					bind:archivedAtElement
					bind:createdAtElement
				/>
				·
				<Author
					{isCreating}
					{isEditing}
					{isPreviewing}
					author={announcementContent.author}
					bind:authorElement
				/>
			</h4>

			<Tags {isCreating} {isEditing} {isPreviewing} bind:tagsElement />
		</div>

		{#if $admin_login.logged_in}
			<AdminButtons
				{isCreating}
				bind:isEditing
				bind:isPreviewing
				bind:showDeleteConfirm
				bind:archivedAtElement
				{createAnnouncement}
				{save}
			/>
		{/if}
	</div>

	<Divider />

	<Content
		{isCreating}
		{isEditing}
		{isPreviewing}
		content={announcementContent.content}
		bind:contentElement
	/>

	<Attachments
		{isCreating}
		{isEditing}
		{isPreviewing}
		{removeAttachment}
		{addAttachment}
		attachments={announcementContent.attachments}
		bind:attachmentsElement
	/>
</div>

<style lang="scss">
	.card {
		display: flex;
		flex-direction: column;
		padding: 2rem;
		margin-bottom: 3rem;
		border-radius: 1rem;
		background-color: var(--surface-eight);
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 2rem;

		.header-data {
			width: 100%;
		}
	}

	@media (max-width: 767px) {
		.card {
			background-color: initial;
			padding: 0;
			border-radius: 0;
		}
	}
</style>
