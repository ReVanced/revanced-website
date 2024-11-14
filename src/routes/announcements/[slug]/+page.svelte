<script lang="ts">
	import Footer from '$layout/Footer/FooterHost.svelte';
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { createQuery } from '@tanstack/svelte-query';
	import { queries } from '$data/api';
	import Query from '$lib/components/Query.svelte';
	import moment from 'moment';
	import Gallery from '$lib/components/Gallery.svelte';
	import { admin_login } from '$lib/stores';
	import { admin } from '$data/api';
	import Button from '$lib/components/Button.svelte';
	import { goto } from '$app/navigation';
	import Dialogue from '$lib/components/Dialogue.svelte';

	$: isEditing = false;
	$: isSaved = false;
	let showDeleteConfirm = false;

	let titleElement: HTMLHeadingElement | null;
	$: titleElement;

	let authorElement: HTMLSpanElement | null;
	$: authorElement;

	let contentElement: HTMLDivElement | null;
	$: contentElement;

	$: announcementIdNumber = Number($page.url.pathname.split('/').pop());
	$: query = createQuery(queries.announcementById(announcementIdNumber));

	const save = async () => {
		if (!$query.data?.announcement) return;

		const data = {
			...$query.data.announcement,
			title: titleElement?.textContent?.trim() || $query.data.announcement.title,
			author: authorElement?.textContent?.trim() || $query.data.announcement.author,
			content: contentElement?.textContent?.trim() || $query.data.announcement.content
		};

		// remove id or it'll throw a 400
		const { id, ...new_announcement_data } = data;

		await admin.update_announcement(announcementIdNumber, new_announcement_data);
		await $query.refetch();
	};

	const delete_ann = async () => {
		await admin.delete_announcement(announcementIdNumber);
		goto('/announcements');
	};

	const handle_unload = (e: BeforeUnloadEvent) => {
		if (isEditing && !isSaved) e.preventDefault();
	};

	const handle_focus = () => {
		isEditing = true;
	};

	const handle_blur = async () => {
		await save();
		isEditing = false;
		isSaved = true;
	};

	const handle_input = () => {
		isSaved = false;
	};
</script>

<svelte:window on:beforeunload={handle_unload} />

<Dialogue bind:modalOpen={showDeleteConfirm}>
	<svelte:fragment slot="title">Confirm?</svelte:fragment>
	<svelte:fragment slot="description">Do you want to delete this announcement?</svelte:fragment>
	<svelte:fragment slot="buttons">
		<Button type="filled" on:click={delete_ann}>OK</Button>
		<Button type="text" on:click={() => (showDeleteConfirm = !showDeleteConfirm)}>Cancel</Button>
	</svelte:fragment>
</Dialogue>

<main class="wrapper" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	<Query {query} let:data>
		<div class="card">
			<div class="header">
				<div class="header-data">
					<h1
						contenteditable={$admin_login.logged_in}
						bind:this={titleElement}
						on:focus={handle_focus}
						on:blur={handle_blur}
						on:input={handle_input}
					>
						{data.announcement.title}
					</h1>

					<h4>
						<span>
							{moment(data.announcement.created_at).format('MMMM D, YYYY [at] h:mm A')}
						</span>
						·
						<span
							contenteditable={$admin_login.logged_in}
							bind:this={authorElement}
							on:focus={handle_focus}
							on:blur={handle_blur}
							on:input={handle_input}
						>
							{data.announcement.author}
						</span>
					</h4>
				</div>

				{#if $admin_login.logged_in}
					<div class="edit-buttons-container">
						<Button type="filled" danger on:click={() => (showDeleteConfirm = !showDeleteConfirm)}>
							Delete
						</Button>
					</div>
				{/if}
			</div>

			<svg
				aria-hidden="true"
				width="100%"
				height="8"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<pattern id="a" width="91" height="8" patternUnits="userSpaceOnUse">
					<path
						d="M114 4c-5.067 4.667-10.133 4.667-15.2 0S88.667-.667 83.6 4 73.467 8.667 68.4 4 58.267-.667 53.2 4 43.067 8.667 38 4 27.867-.667 22.8 4 12.667 8.667 7.6 4-2.533-.667-7.6 4s-10.133 4.667-15.2 0S-32.933-.667-38 4s-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0"
						stroke-linecap="square"
					/>
				</pattern>
				<rect width="100%" height="100%" fill="url(#a)" />
			</svg>

			<div
				class="content"
				contenteditable={$admin_login.logged_in}
				bind:this={contentElement}
				on:focus={handle_focus}
				on:blur={handle_blur}
				on:input={handle_input}
			>
				{@html data.announcement.content}
			</div>

			<svg
				aria-hidden="true"
				width="100%"
				height="8"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<pattern id="a" width="91" height="8" patternUnits="userSpaceOnUse">
					<path
						d="M114 4c-5.067 4.667-10.133 4.667-15.2 0S88.667-.667 83.6 4 73.467 8.667 68.4 4 58.267-.667 53.2 4 43.067 8.667 38 4 27.867-.667 22.8 4 12.667 8.667 7.6 4-2.533-.667-7.6 4s-10.133 4.667-15.2 0S-32.933-.667-38 4s-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0"
						stroke-linecap="square"
					/>
				</pattern>
				<rect width="100%" height="100%" fill="url(#a)" />
			</svg>

			{#if data.announcement.attachments.length > 0}
				<Gallery images={data.announcement.attachments} />
			{/if}
		</div>
	</Query>
</main>

<Footer />

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
