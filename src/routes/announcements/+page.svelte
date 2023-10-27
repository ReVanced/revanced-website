<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import { queries } from '$data/api';
	import { createQuery } from '@tanstack/svelte-query';

	import Meta from '$lib/components/Meta.svelte';
	import Footer from '$layout/Footer/FooterHost.svelte';
	import Query from '$lib/components/Query.svelte';
	import Announcement from './Announcement.svelte';
	import Announcement2 from './Announcement2.svelte';
	import { get_access_token } from '$data/api/settings';
	import PostAnnouncementDialogue from './PostAnnouncementDialogue.svelte';
	import Button from '$lib/components/Button.svelte';

	const announcementsQuery = createQuery(['announcements'], queries.announcements());

	let showPostAnnouncementDialogue = false;
</script>

<Meta
	title="Announcements"
	schema={{
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'ReVanced Announcements',
		abstract: 'Control panel for ReVanced announcements',
		breadcrumb: 'Home > Announcements',
		publisher: {
			'@type': 'Organization',
			name: 'ReVanced',
			url: 'https://revanced.app/',
			logo: {
				'@type': 'ImageObject',
				url: 'https://revanced.app/embed.png'
			}
		}
	}}
/>

<main class="wrapper" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	<h1>
		<span style=" color: var(--accent-color);">ReVanced</span>
		Announcements
	</h1>
	<p>Here you can find all official announcements that have been made by ReVanced.</p>
	<br />
	<Query query={announcementsQuery} let:data>
		{#if data.announcements instanceof Array}
			<ul id="channels">
				{#each [...new Set(data.announcements.map((a) => a.channel))] as channel}
					<li>{channel}</li>
				{/each}
			</ul>
		{/if}
		{#if get_access_token()}
			<PostAnnouncementDialogue bind:show={showPostAnnouncementDialogue} />
			<br />
			<Button
				type="filled"
				on:click={() => {
					showPostAnnouncementDialogue = true;
				}}
			>
				Post announcement
			</Button>
			<br />
		{/if}

		{#if data.announcements instanceof Array}
			<br />
			<div class="announcements">
				{#each data.announcements as announcement}
					<Announcement {announcement} />
					<Announcement2 {announcement} />
				{/each}
			</div>
			<br />
			<p>You reached the beginning of the announcements.</p>
		{:else}
			<p>There are no announcements to show.</p>
		{/if}
	</Query>
	<br />
</main>

<Footer />

<style lang="scss">
	.announcements {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
	}

	li {
		cursor: pointer;
		color: var(--grey-five);
		text-align: center;
		list-style: none;
		font-weight: 500;
		transition: all 0.25s var(--bezier-one);
		padding: 10px 16px;
		border-radius: 10px;
		display: flex;
		background-color: var(--grey-six);
	}

	li:hover {
		color: var(--white);
		background-color: var(--grey-one);
	}

	li.selected {
		background-color: var(--accent-low-opacity);
		color: var(--accent-color);
	}

	li.selected span {
		color: var(--accent-color);
	}

	#channels {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
</style>
