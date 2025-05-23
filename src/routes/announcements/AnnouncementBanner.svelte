<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { queries } from '$data/api';
	import { read_announcements } from '$lib/stores';
	import Banner from '$lib/components/Banner.svelte';
	import { goto } from '$app/navigation';
	import type { ResponseAnnouncement } from '$lib/types';
	import Close from 'svelte-material-icons/Close.svelte';
	import { browser } from '$app/environment';

	let latestUnreadAnnouncement: ResponseAnnouncement | undefined = undefined;

	const query = createQuery(queries.announcements());

	$: {
		if ($query.data?.announcements && $query.data.announcements.length > 0) {
			const announcement = $query.data.announcements[0];
			if (!$read_announcements.has(announcement.id)) {
				latestUnreadAnnouncement = announcement;
			} else {
				latestUnreadAnnouncement = undefined;
			}
		}
	}

	function handleClick() {
		if (latestUnreadAnnouncement) {
			const slug = latestUnreadAnnouncement.title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-+|-+$/g, '');
			goto(`/announcements/${latestUnreadAnnouncement.id}-${slug}`);
		}
	}

	function handleClose() {
		if (latestUnreadAnnouncement && browser) {
			$read_announcements.add(latestUnreadAnnouncement.id);
			localStorage.setItem('read_announcements', JSON.stringify(Array.from($read_announcements)));
			latestUnreadAnnouncement = undefined;
		}
	}

	function getBannerLevel(level: number | undefined): 'info' | 'warning' | 'caution' {
		if (!level) return 'info';
		switch (level) {
			case 1:
				return 'warning';
			case 2:
				return 'caution';
			default:
				return 'info';
		}
	}
</script>

{#if latestUnreadAnnouncement}
	<div class="banner-container">
		<button class="banner-wrapper" on:click={handleClick}>
			<Banner level={getBannerLevel(latestUnreadAnnouncement.level)} permanent={true}>
				<div class="banner-content">
					<span class="link-text">{latestUnreadAnnouncement.title}</span>
					<button class="close-button" on:click|stopPropagation={handleClose}>
						<Close size="20" />
					</button>
				</div>
			</Banner>
		</button>
	</div>
{/if}

<style lang="scss">
	.banner-container {
		width: 100%;
		background-color: var(--surface-eight);
	}

	.banner-wrapper {
		cursor: pointer;
		width: 100%;
		margin: 0 auto;
		border: none;
		padding: 0;
		background: none;

		&:hover .link-text {
			text-decoration: underline;
		}
	}

	.banner-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		width: 100%;
	}

	.link-text {
		flex: 1;
		text-decoration: none;
		color: var(--text-one);
		font-weight: 500;

		&:hover {
			text-decoration: underline;
		}
	}

	.close-button {
		background: none;
		border: none;
		padding: 4px;
		cursor: pointer;
		color: inherit;
		opacity: 0.7;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;

		&:hover {
			opacity: 1;
			background-color: rgba(0, 0, 0, 0.1);
		}
	}

	@media (max-width: 767px) {
		.banner-container {
			margin-bottom: 0.5rem;
		}

		.banner-wrapper {
			padding: 0 0.5rem;
		}
	}
</style>
