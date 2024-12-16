<script lang="ts">
	import { admin_login } from '$lib/stores';
	import Title from './Title.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import AdminButtons from './AdminButtons.svelte';
	import Author from './Author.svelte';
	import Date from './Date.svelte';
	import Content from './Content.svelte';
	import Attachments from './Attachments.svelte';
	import Tags from './Tags.svelte';
	import type { Announcement } from '$lib/types';

	export let isCreating: boolean;
	export let announcement: Announcement | undefined;
	export let announcementIdNumber: number | undefined;

	let isPreviewing = false;
	let isEditing = false;
	let showDeleteConfirm = false;

	const draftInputs: Announcement = {
		...announcement,
		id: undefined
	};
</script>

<div class="card">
	<div class="header">
		<div class="header-data">
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

		{#if $admin_login.logged_in}
			<AdminButtons
				{isCreating}
				bind:isEditing
				bind:isPreviewing
				bind:showDeleteConfirm
				bind:archivedAtInput={draftInputs.archived_at}
				{draftInputs}
				{announcementIdNumber}
			/>
		{/if}
	</div>

	<Divider />

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
