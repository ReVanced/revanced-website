<script lang="ts">
	import { announcementsQuery, readAnnouncements } from '$stores';
	import { goto } from '$app/navigation';
	import Button from '$components/atoms/Button.svelte';
	import ArrowRight from 'svelte-material-icons/ArrowRight.svelte';
	import CloseIcon from 'svelte-material-icons/Close.svelte';

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
		goto(`/announcements/${latestUnreadAnnouncement.id}`);
		readAnnouncements.markAsRead(latestUnreadAnnouncement.id);
	}

	function handleDismiss(e: MouseEvent) {
		e.stopPropagation();
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
			<button class="dismiss" onclick={handleDismiss} aria-label="Dismiss announcement">
				<CloseIcon size={24} />
			</button>
			<Button
				variant={bannerLevel === 'caution' ? 'onDangerBackground' : 'default'}
				onclick={handleClick}
			>
				<span class="read-more-text">Read more</span>
				<ArrowRight size={20} />
			</Button>
		</div>
	</div>
{/if}

<style>
	.title {
		line-height: 26px;
		font-size: 20px;
		margin: 0;
	}

	.description {
		line-height: 20px;
		font-size: 14px;
		margin: 0;
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
		z-index: var(--z-toast);
	}

	.banner.info {
		background-color: var(--surface-four);
		color: var(--text-one);
	}

	.banner.info .description {
		color: var(--text-four);
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

	.read-more-text {
		display: inline-flex;
		align-items: center;
	}

	.dismiss {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.65rem;
		background: transparent;
		border: none;
		cursor: pointer;
		color: currentColor;
		opacity: 0.7;
		transition: filter 0.2s ease;
		border-radius: 4px;
		font-size: 1rem;
	}

	.dismiss:hover {
		filter: brightness(0.75);
	}

	.dismiss:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}
</style>
