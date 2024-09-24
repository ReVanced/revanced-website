<script lang="ts">
	import moment from 'moment';
	import { onMount } from 'svelte';

	import Svg from '$lib/components/Svg.svelte';
	import Dialogue from '$lib/components/Dialogue.svelte';
	import type { Announcement } from '$lib/types';
	import UnreadDot from './UnreadDot.svelte';

	export let announcement: Announcement;

	let showContent = false;
	let isRead: boolean;
	let isUserAdmin: boolean = true; // TODO: add logic later

	function isAnnouncementRead() {
		isRead = (localStorage.getItem('read_announcements') ?? '')
			.split(',')
			.includes(String(announcement.id));
	}

	function setAnnouncementRead() {
		const ids = (localStorage.getItem('read_announcements') ?? '').split(',').filter((id) => !!id);
		if (!ids.includes(String(announcement.id)))
			localStorage.setItem('read_announcements', ids.concat(String(announcement.id)).join(','));
		isRead = true;
	}

	const showAnnouncement = () => {
		showContent = true;
		setAnnouncementRead();
	};

	onMount(isAnnouncementRead);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="announcement-card" on:click={showAnnouncement}>
	{#if isRead !== undefined && !isRead}
		<UnreadDot animated />
	{/if}
	<!-- {#if announcement.attachmentUrls}
		<img src={announcement.attachmentUrls[0]} alt="Banner" />
	{/if} -->
	<div class="content">
		<div class="text">
			<h3>{announcement.title}</h3>
			<div class="description">
				{announcement.content}
			</div>
			<span class="date">{moment(announcement.createdAt.value).fromNow()}</span>
		</div>
		{#if isUserAdmin}
			<div class="action">
				<button on:click={showAnnouncement} aria-label="Settings">
					<Svg viewBoxHeight={24} svgHeight={24}>
						<path
							d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"
						/>
					</Svg>
				</button>
			</div>
		{/if}
	</div>
</div>
<!-- {#if $$slots.channel}
	<div class="channel"><slot name="channel" /></div>
{/if} -->
<!-- <h4>
	by
	<a class="author" href="http://github.com/{author}" target="_blank" rel="noopener noreferrer">
		{author}
	</a>,
</h4> -->
<!-- <button class="read-more" on:click={() => (showContent = true)}>Read more</button> -->

<Dialogue bind:modalOpen={showContent} fullscreen>
	<svelte:fragment slot="icon">
		<img
			src="https://github.com/{announcement.author}.png"
			alt="Author avatar"
			class="author-avatar"
		/>
	</svelte:fragment>
	<svelte:fragment slot="title">{announcement.title}</svelte:fragment>
	<svelte:fragment slot="description">
		<slot name="content" />
	</svelte:fragment>
</Dialogue>

<style lang="scss">
	.announcement-card {
		height: fit-content;
		color: var(--text-four);
		background-color: var(--surface-seven);
		border: 1px solid var(--border);
		border-radius: 12px;
		button:hover path {
			fill: var(--secondary);
		}
		.content {
			display: flex;
			justify-content: space-between;
			padding: 12px 16px;
			.text {
				display: flex;
				flex-direction: column;
				gap: 12px;
			}
		}

		/* img {
			width: 100%;
			border-radius: 12px 12px 0px 0px;
		} */

		button {
			background-color: transparent;
			fill: var(--primary);
			border: none;
			cursor: pointer;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		&:hover {
			background-color: var(--surface-four);
		}

		.description {
			display: -webkit-box;
			line-clamp: 2;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}
	}
</style>
