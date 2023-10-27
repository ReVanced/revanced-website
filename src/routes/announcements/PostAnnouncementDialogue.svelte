<script lang="ts">
	import { queries } from '$data/api';
	import Button from '$lib/components/Button.svelte';
	import Dialogue from '$lib/components/Dialogue.svelte';
	import type { PostAnnouncement } from '$lib/types';
	import { createMutation } from '@tanstack/svelte-query';

	export let show = false;

	let postAnnouncement: PostAnnouncement = {
		author: 'ReVanced',
		title: 'New announcement',
		content: {
			message: '',
			attachment_urls: ['']
		},
		channel: 'ReVanced',
		level: 0
	};

	let content = postAnnouncement.content;

	let postAnnouncementMutation = createMutation(
		queries.postAnnouncement(postAnnouncement.channel, postAnnouncement)
	);
</script>

<Dialogue bind:modalOpen={show}>
	<svelte:fragment slot="title">Post announcement</svelte:fragment>
	<div class="description">
		<label for="author">Author</label>
		<input type="text" bind:value={postAnnouncement.author} />
		<label for="title">Title</label>
		<input type="text" bind:value={postAnnouncement.title} />
		<label for="content">Message</label>
		<textarea bind:value={content.message} />
		<label for="attachment">Attachment URL</label>
		{#if content.attachment_urls}
			{#each content.attachment_urls as value}
				<input
					type="text"
					bind:value
					on:input={() => {
						if (value === '') {
							if (content.attachment_urls.length > 1) {
								content.attachment_urls = content.attachment_urls.filter((url) => url !== '');
								content.attachment_urls = [...content.attachment_urls, ''];
							}
						} else {
							let empty = content.attachment_urls.filter((url) => url === '');
							if (empty.length < 1) content.attachment_urls = [...content.attachment_urls, ''];
						}
					}}
				/>
			{/each}
		{/if}
		<label for="channel">Channel</label>
		<input type="text" bind:value={postAnnouncement.channel} />
		<label for="level">Level</label>
		<input type="number" bind:value={postAnnouncement.level} />
	</div>
	<svelte:fragment slot="buttons">
		<Button
			type="text"
			on:click={() => {
				show = false;
			}}>Back</Button
		>
		<Button
			type="filled"
			on:click={() => {
				postAnnouncement.content.attachment_urls = postAnnouncement.content.attachment_urls.filter(
					(url) => url !== ''
				);

				$postAnnouncementMutation.mutate();

				show = false;
			}}>Post</Button
		>
	</svelte:fragment>
</Dialogue>

<style lang="scss">
	.description {
		display: flex;
		width: 100%;
		flex-direction: column;
		color: var(--grey-five);
		gap: 1rem;
	}

	textarea {
		min-width: 100%;
		max-width: 100%;
	}
</style>
