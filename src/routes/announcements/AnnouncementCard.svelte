<script lang="ts">
	import moment from 'moment';
	import { onMount } from 'svelte';

	import Svg from '$lib/components/Svg.svelte';
	import Dialogue from '$lib/components/Dialogue.svelte';
	import type { Announcement } from '$lib/types';

	export let announcement: Announcement;

	let showContent = false;
	let read: boolean;

	function isAnnouncementRead(): boolean {
		return (localStorage.getItem('read_announcements') ?? '')
			.split(',')
			.includes(String(announcement.id));
	}

	function setAnnouncementRead() {
		const ids = (localStorage.getItem('read_announcements') ?? '').split(',').filter((id) => !!id);
		if (!ids.includes(String(announcement.id)))
			localStorage.setItem('read_announcements', ids.concat(String(announcement.id)).join(','));
	}

	const showAnnouncement = () => {
		showContent = true;
		setAnnouncementRead();
	};

	onMount(() => {
		read = isAnnouncementRead();
	});
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="announcement-card" on:click={showAnnouncement}>
	{#if announcement.attachmentUrls}
		<img src={announcement.attachmentUrls[0]} alt="Banner" />
	{/if}
	<div class="content">
		<div class="text">
			<h3>{announcement.title}</h3>
			<div class="description">
				{announcement.content}
			</div>
			<span class="date">{moment(announcement.createdAt.value).fromNow()}</span>
		</div>
		<div class="action">
			<button on:click={showAnnouncement} aria-label="Settings">
				<Svg viewBoxHeight={24} svgHeight={20}>
					<path
						d="M 19.1 12.9 C 19.1 12.6 19.2 12.3 19.2 12 C 19.2 11.7 19.2 11.4 19.1 11.1 L 21.1 9.5 C 21.3 9.4 21.3 9.1 21.2 8.9 L 19.3 5.6 C 19.2 5.4 18.9 5.3 18.7 5.4 L 16.3 6.4 C 15.8 6 15.3 5.7 14.7 5.5 L 14.3 3 C 14.3 2.8 14.1 2.6 13.8 2.6 L 10 2.6 C 9.8 2.6 9.6 2.8 9.5 3 L 9.2 5.3 C 8.7 5.6 8.1 5.9 7.6 6.3 L 5.2 5.3 C 5 5.2 4.8 5.3 4.6 5.5 L 2.7 8.9 C 2.6 9.1 2.7 9.3 2.9 9.5 L 4.9 11.1 C 4.9 11.4 4.8 11.7 4.8 12 C 4.8 12.3 4.8 12.6 4.9 12.9 L 2.9 14.5 C 2.7 14.6 2.7 14.9 2.8 15.1 L 4.7 18.4 C 4.8 18.6 5.1 18.7 5.3 18.6 L 7.7 17.6 C 8.2 18 8.7 18.3 9.3 18.5 L 9.7 21 C 9.8 21.2 9.9 21.4 10.2 21.4 L 14 21.4 C 14.2 21.4 14.4 21.2 14.5 21 L 14.9 18.5 C 15.5 18.3 16 17.9 16.5 17.6 L 18.9 18.6 C 19.1 18.7 19.4 18.6 19.5 18.4 L 21.4 15.1 C 21.5 14.9 21.5 14.6 21.3 14.5 L 19.1 12.9 Z M 12 15.6 C 10 15.6 8.4 14 8.4 12 C 8.4 10 10 8.4 12 8.4 C 14 8.4 15.6 10 15.6 12 C 15.6 14 14 15.6 12 15.6 Z"
					/>
				</Svg>
			</button>
		</div>
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

		img {
			width: 100%;
			border-radius: 12px 12px 0px 0px;
		}

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
			line-clamp: 4;
			-webkit-line-clamp: 4;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}
	}
</style>
