<script lang="ts">
	import { announcementsQuery, readAnnouncements } from '$stores';
	import { goto } from '$app/navigation';
	import Button from '$components/atoms/Button.svelte';
	import ArrowRight from 'virtual:icons/material-symbols/arrow-right-alt';
	import CloseIcon from 'virtual:icons/material-symbols/close';

	const latestUnreadAnnouncement = $derived.by(() => {
		const announcements = announcementsQuery.data ?? [];

		const nonArchived = announcements.filter(
			(a) => !a.archived_at || new Date(a.archived_at) > new Date()
		);

		const latest = nonArchived[0];
		return latest && !readAnnouncements.isRead(latest.id) ? latest : undefined;
	});

	function handleClick() {
		if (!latestUnreadAnnouncement) return;
		readAnnouncements.markAsRead(latestUnreadAnnouncement.id);
		goto(`/announcements/${latestUnreadAnnouncement.id}`);
	}

	function handleDismiss() {
		if (!latestUnreadAnnouncement) return;
		readAnnouncements.markAsRead(latestUnreadAnnouncement.id);
	}

	const bannerLevel = $derived(
		latestUnreadAnnouncement?.level && latestUnreadAnnouncement.level > 0 ? 'caution' : 'info'
	);
</script>

{#if latestUnreadAnnouncement}
	<div class="banner {bannerLevel}">
		<div class="text">
			<h1 class="title">We have an announcement</h1>
			<h2 class="description">
				You can read more about "{latestUnreadAnnouncement.title}" in our latest post.
			</h2>
		</div>
		<div class="actions">
			<Button
				variant={bannerLevel === 'caution' ? 'onDangerBackground' : 'onInfoBackground'}
				onclick={handleClick}
			>
				Read more
				<span class="arrow-icon"><ArrowRight /></span>
			</Button>
			<button class="dismiss" onclick={handleDismiss} aria-label="Dismiss announcement">
				<CloseIcon />
			</button>
		</div>
	</div>
{/if}

<style>
	.title {
		line-height: 26px;
		color: currentColor;
		font-size: 20px;
		margin: 0;
		font-weight: 500;
	}

	.description {
		line-height: 24px;
		color: currentColor;
		font-size: 15px;
		margin: 0;
		font-weight: 400;
		letter-spacing: 0.01em;
	}

	.banner {
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		gap: 1.3rem;
		width: 100%;
		margin: 0;
		padding: 24px 40px;
		border-radius: 0;
		font-size: 0.87rem;
		position: relative;
		z-index: 10000;
	}

	.banner.info {
		background-color: var(--accent-color);
		color: #0d2d44;
	}

	.banner.caution {
		background-color: var(--red-three);
		color: #601410;
	}

	@media (max-width: 768px) {
		.banner {
			flex-direction: column;
			align-items: stretch;
			padding: 1.1rem 1.3rem;
		}
	}

	.text {
		display: flex;
		flex-direction: column;
		flex: 1;
		gap: 0.55rem;
		word-wrap: break-word;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 1rem;
	}

	.arrow-icon {
		display: inline-flex;
		align-items: center;
		vertical-align: middle;
	}

	.dismiss {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		background: transparent;
		border: none;
		cursor: pointer;
		color: currentColor;
		opacity: 0.7;
		transition: opacity 0.2s ease;
		border-radius: 4px;
	}

	.dismiss:hover {
		opacity: 1;
		background: rgba(0, 0, 0, 0.1);
	}

	.dismiss:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}
</style>
