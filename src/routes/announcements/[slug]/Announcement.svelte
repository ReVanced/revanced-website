<script lang="ts">
	import { goto } from '$app/navigation';
	import { admin } from '$data/api';
	import Button from '$lib/components/Button.svelte';
	import Dialogue from '$lib/components/Dialogue.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import { admin_login } from '$lib/stores';
	import moment from 'moment';
	import TagsHost from '../TagsHost.svelte';

	export let isCreating, announcementContent, announcementIdNumber, query;

	let isPreviewing = false;
	let isEditing = false;
	let isSaved = false;
	let showDeleteConfirm = false;

	let titleElement: string = announcementContent?.title ?? '';
	let authorElement: string = announcementContent?.author ?? '';
	let contentElement: string = announcementContent?.content ?? '';

	const save = async () => {
		const data = {
			title: titleElement,
			author: authorElement,
			content: contentElement
		};
		await admin.update_announcement(announcementIdNumber!, data);
		await $query.refetch();

		announcementContent.title = titleElement;
		announcementContent.author = authorElement;
		announcementContent.content = contentElement;

		isEditing = false;
		isSaved = true;
	};

	const createAnnouncement = async () => {
		const data = {
			title: titleElement.toString(),
			author: authorElement.toString(),
			content: contentElement.toString(),
			attachments: attachmentsElement,
			tags: ['youtube', 'revanced'],
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
			{#if isEditing || isCreating}
				{#if isPreviewing}
					<h1>
						{titleElement}
					</h1>
				{:else}
					<input
						type="text"
						id="title"
						bind:value={titleElement}
						class:empty={!titleElement.trim()}
						placeholder="Enter title"
					/>
				{/if}
			{:else}
				<h1>
					{announcementContent.title}
				</h1>
			{/if}

			<h4>
				<span>
					{moment(announcementContent.created_at).format('MMMM D, YYYY [at] h:mm A')}
				</span>
				·
				{#if isEditing || isCreating}
					{#if isPreviewing}
						<span>
							{authorElement}
						</span>
					{:else}
						<input
							type="text"
							id="author"
							bind:value={authorElement}
							class:empty={!authorElement.trim()}
							placeholder="Enter author name"
						/>
					{/if}
				{:else}
					<span>
						{announcementContent.author}
					</span>
				{/if}
			</h4>
		</div>

		{#if $admin_login.logged_in}
			<div class="edit-buttons-container">
				{#if isEditing}
					<Button
						type="icon"
						icon={isPreviewing ? 'hide' : 'show'}
						on:click={() => (isPreviewing = !isPreviewing)}
					/>
					<Button type="icon" icon={'close'} on:click={() => (isEditing = false)} />
					<Button type="icon" icon={'check'} on:click={save} />
				{:else if isCreating}
					<Button
						type="icon"
						icon={isPreviewing ? 'hide' : 'show'}
						on:click={() => (isPreviewing = !isPreviewing)}
					/>
					<Button type="icon" icon={'check'} on:click={createAnnouncement} />
				{:else}
					<Button
						type="icon"
						icon={'delete'}
						on:click={() => (showDeleteConfirm = !showDeleteConfirm)}
					/>
					<Button type="icon" icon={'edit'} on:click={() => (isEditing = !isEditing)} />
				{/if}
			</div>
		{/if}
	</div>

	<TagsHost announcements={[announcementContent]} />

	<svg aria-hidden="true" width="100%" height="8" fill="none" xmlns="http://www.w3.org/2000/svg">
		<pattern id="a" width="91" height="8" patternUnits="userSpaceOnUse">
			<path
				d="M114 4c-5.067 4.667-10.133 4.667-15.2 0S88.667-.667 83.6 4 73.467 8.667 68.4 4 58.267-.667 53.2 4 43.067 8.667 38 4 27.867-.667 22.8 4 12.667 8.667 7.6 4-2.533-.667-7.6 4s-10.133 4.667-15.2 0S-32.933-.667-38 4s-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0"
				stroke-linecap="square"
			/>
		</pattern>
		<rect width="100%" height="100%" fill="url(#a)" />
	</svg>

	{#if isEditing || isCreating}
		{#if isPreviewing}
			<div class="content">
				{@html contentElement}
			</div>
		{:else}
			<textarea
				bind:value={contentElement}
				id="content"
				class:empty={!announcementContent.content.trim()}
				placeholder="Enter content"
			/>
		{/if}
	{:else}
		<div class="content">
			{@html announcementContent.content}
		</div>
	{/if}

	{#if isEditing || isCreating}
		<div></div>
	{:else if announcementContent.attachments.length > 0}
		<svg aria-hidden="true" width="100%" height="8" fill="none" xmlns="http://www.w3.org/2000/svg">
			<pattern id="a" width="91" height="8" patternUnits="userSpaceOnUse">
				<path
					d="M114 4c-5.067 4.667-10.133 4.667-15.2 0S88.667-.667 83.6 4 73.467 8.667 68.4 4 58.267-.667 53.2 4 43.067 8.667 38 4 27.867-.667 22.8 4 12.667 8.667 7.6 4-2.533-.667-7.6 4s-10.133 4.667-15.2 0S-32.933-.667-38 4s-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0"
					stroke-linecap="square"
				/>
			</pattern>
			<rect width="100%" height="100%" fill="url(#a)" />
		</svg>

		<Gallery images={announcementContent.attachments} />
	{/if}
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

	input,
	textarea {
		&,
		&:focus {
			border: none;
			outline: none;
			border-radius: 0;
		}

		&#title {
			width: 100%;
			border: none;
			padding: 0;

			color: var(--text-one);
			font-size: 2.5rem;
			font-weight: 700;
			line-height: 4rem;
			letter-spacing: -0.025em;
		}

		&#author {
			border: none;
			padding: 0;

			color: var(--secondary);
			font-size: 1rem;
			font-weight: 400;
			letter-spacing: 0.02rem;
		}

		&#content {
			white-space: pre-wrap;
			border: none;
			padding: 0;
		}
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

	.edit-buttons-container {
		display: flex;
		gap: 1rem;
	}

	h1 {
		color: var(--text-one);
		font-size: 2.5rem;
		font-weight: 700;
		letter-spacing: -0.025em;
		border-bottom: 1px solid var(--grey-three);
	}

	svg {
		margin: 1.5rem 0;

		path {
			stroke: var(--border);
		}
	}

	.content {
		color: var(--text-four);
		white-space: pre-wrap;

		:global(a) {
			color: var(--primary);
			font-weight: 600;
			font-size: 0.95rem;
			text-decoration: none;

			&:hover {
				text-decoration: underline var(--secondary);
				color: var(--text-one);
			}
		}

		:global(h2),
		:global(h3),
		:global(h4),
		:global(h5),
		:global(h6) {
			color: var(--secondary);
			margin-top: 1.25rem;
			margin-bottom: 1.25rem;
		}

		:global(li) {
			list-style-position: inside;
			font-size: 0.9rem;
			font-weight: 500;
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
