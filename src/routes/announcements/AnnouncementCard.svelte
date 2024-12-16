<script lang="ts">
	import moment from 'moment';
	import { onMount } from 'svelte';
	import type { ResponseAnnouncement } from '$lib/types';
	import NewHeader from './NewHeader.svelte';
	import { queries } from '$data/api';
	import { dev_log } from '$util/dev';
	import { useQueryClient } from '@tanstack/svelte-query';
	import TagChip from './TagChip.svelte';
	import { read_announcements } from '$lib/stores';

	export let announcement: ResponseAnnouncement;

	const client = useQueryClient();

	let isRead: boolean;

	function prefetch() {
		const query = queries['announcementById'](announcement.id);
		dev_log('Prefetching', query);
		client.prefetchQuery(query);
	}

	function setAnnouncementRead() {
		isRead = true;

		$read_announcements.add(announcement.id);
		localStorage.setItem('read_announcements', JSON.stringify(Array.from($read_announcements)));
	}

	onMount(() => {
		isRead = $read_announcements.has(announcement.id);
	});
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<a
	data-sveltekit-preload-data
	on:mouseenter={prefetch}
	href="/announcements/{announcement.id}"
	on:click={setAnnouncementRead}
>
	<div class="card {announcement.attachments.length > 0 ? 'attachment' : 'no-attachment'}">
		{#if isRead !== undefined && !isRead}
			<NewHeader />
		{/if}
		{#if announcement.attachments.length > 0}
			<img
				src={announcement.attachments[0]}
				class={isRead === undefined || isRead ? '' : 'no-border-radius'}
				alt="Banner"
				onerror="this.style.display='none'"
			/>
		{/if}
		<div class="content">
			<div class="header">
				<h3>{announcement.title}</h3>
				<span class="date">
					{moment(announcement.created_at).format('MMMM DD, YYYY')}
				</span>
			</div>
			<div class="footer">
				{#if announcement.content}
					<div class="description">
						{@html announcement.content}
					</div>
				{/if}
				{#if announcement.tags.length > 0}
					<hr />
					<div class="tag-list">
						{#each announcement.tags as tag}
							<TagChip {tag} clickable={false} />
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</a>

<style lang="scss">
	a {
		color: inherit !important;
		text-decoration: inherit !important;
		font-weight: inherit !important;
		font-size: inherit !important;
		user-select: none !important;
	}

	hr {
		justify-content: end;
	}

	.card {
		&.attachment {
			grid-row: span 2;
		}

		display: flex;
		flex-direction: column;
		height: 100%;

		background-color: var(--surface-seven);
		border: 1px solid var(--border);
		border-radius: 12px;
		&:hover {
			background-color: var(--surface-four);
		}

		img {
			height: 150px;
			object-fit: cover;
			width: 100%;
			border-radius: 12px 12px 0px 0px;

			&.no-border-radius {
				border-radius: 0;
			}
		}

		.content {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			gap: 12px;

			height: 100%;
			padding: 12px 16px;

			color: var(--text-four);

			.header,
			.footer {
				display: flex;
				flex-direction: column;
				.tag-list {
					display: flex;
					align-items: center;
					flex-wrap: wrap;
					gap: 4px;
				}
			}

			.footer {
				gap: 12px;
			}

			.description {
				display: -webkit-inline-box;
				line-clamp: 3;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
				overflow: hidden;

				:global(a) {
					color: var(--primary);
					text-decoration: none;
					pointer-events: none;
				}

				:global(h1),
				:global(h2),
				:global(h3),
				:global(h4),
				:global(h5),
				:global(h6) {
					color: var(--secondary);
					line-height: 1.75rem;
					margin: 0;
				}

				:global(h1) {
					font-size: 1.75rem;
				}

				:global(h2) {
					font-size: 1.25rem;
				}

				:global(h3) {
					font-size: 1rem;
				}

				:global(h4) {
					font-size: 0.5rem;
				}

				:global(li) {
					list-style-position: inside;
					font-size: 0.9rem;
					font-weight: 500;
				}
			}
		}
	}
</style>
