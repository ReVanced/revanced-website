<script lang="ts">
	import { admin_login } from '$lib/stores.svelte';
	import Title from './Title.svelte';
	import Divider from '$ui/Divider.svelte';
	import AdminButtons from './AdminButtons.svelte';
	import Author from './Author.svelte';
	import Date from './Date.svelte';
	import Content from './Content.svelte';
	import Attachments from './Attachments.svelte';
	import Tags from './Tags.svelte';
	import type { Announcement, ResponseAnnouncement } from '$lib/types';
	import type { CreateQueryResult } from '@tanstack/svelte-query';

	let {
		isCreating,
		announcement,
		announcementIdNumber,
		query = undefined
	}: {
		isCreating: boolean;
		announcement: Announcement | undefined;
		announcementIdNumber: number | undefined;
		query?: CreateQueryResult<{ announcement: ResponseAnnouncement }, unknown> | undefined;
	} = $props();

	let isPreviewing = $state(false);
	let isEditing = $state(false);
	let showDeleteConfirm = $state(false);

	let draftInputs = $state<Announcement>({
		title: '',
		created_at: '',
		tags: []
	});

	$effect(() => {
		if (announcement) {
			Object.assign(draftInputs, {
				...announcement,
				tags: announcement.tags ?? []
			});
		}
	});
</script>

<div class="card">
	<div class="header">
		<div>
			<Title
				{isCreating}
				{isEditing}
				{isPreviewing}
				title={announcement?.title}
				bind:titleInput={draftInputs.title}
			/>

			<h4>
				<Date
					{isCreating}
					{isEditing}
					{isPreviewing}
					createdAt={announcement?.created_at}
					archivedAt={announcement?.archived_at}
					bind:archivedAtInput={draftInputs.archived_at}
					bind:createdAtInput={draftInputs.created_at}
				/>
				<Author
					{isCreating}
					{isEditing}
					{isPreviewing}
					author={announcement?.author}
					bind:authorInput={draftInputs.author}
				/>
			</h4>

			<Tags {isCreating} {isEditing} {isPreviewing} bind:tagsInput={draftInputs.tags} />
		</div>

		{#if admin_login.value.logged_in}
			<AdminButtons
				{isCreating}
				bind:isEditing
				bind:isPreviewing
				bind:showDeleteConfirm
				bind:archivedAtInput={draftInputs.archived_at}
				{draftInputs}
				{announcementIdNumber}
				{query}
			/>
		{/if}
	</div>

	<Divider horizontalPadding="0" />

	<Content
		{isCreating}
		{isEditing}
		{isPreviewing}
		content={announcement?.content}
		bind:contentInput={draftInputs.content}
	/>

	<Attachments
		{isCreating}
		{isEditing}
		{isPreviewing}
		attachments={announcement?.attachments}
		bind:attachmentsInput={draftInputs.attachments}
	/>
</div>

<style lang="scss">
	.card {
		background-color: var(--surface-eight);
		display: flex;
		flex-direction: column;
		padding: 2rem;
		margin-bottom: 3rem;
		border-radius: 1rem;
	}

	.header {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 2rem;
	}

	@media (max-width: 768px) {
		.card {
			background-color: initial;
			padding: 0;
			border-radius: 0;
		}
	}
</style>
