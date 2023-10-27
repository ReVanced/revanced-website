<script lang="ts">
	import type { Announcement } from '$lib/types';
	import { timeAgo } from '$util/date';

	export let announcement: Announcement;

	const diffDays = timeAgo(announcement.created_at);

	let icon = 'info';
	if (announcement.level != null) {
		if (announcement.level > 1) {
			icon = 'error';
		} else if (announcement.level > 0) {
			icon = 'warning';
		}
	}
</script>

<div class="section-container" id={`announcment-${announcement.id}`}>
	<div
		class="title"
	>
		<div class="title-container">
			<img class="icon" src="/icons/{icon}.svg" alt="announcement" />
			<div>
				<h3>{announcement.title}</h3>
				<div class="header-footer">
				<p>{diffDays}</p>
				{#if announcement.author}
					<p class="dot">•</p>
					<p>{announcement.author}</p>
				{/if}
				</div>
			</div>
		</div>
		<div class="header-footer-container">
			<div class="header-footer">
				<p>{announcement.channel}</p>
			</div>
		</div>
	</div>

		<div class="content">
			{#if announcement.content != null}
				{@html announcement.content.message}
				{#if announcement.content.attachment_urls && announcement.content.attachment_urls.length > 0}
					<div class="attachments">
						{#each announcement.content.attachment_urls as attachment}
							<a target="_blank" rel="noreferrer" class="attachments-link" href={attachment}>
								<img src={attachment} alt="attachment" />
							</a>
						{/each}
					</div>
				{/if}
			{/if}
		</div>
</div>

<style lang="scss">
	.title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: var(--grey-six);
		padding: 1rem 1.25rem;
		border-bottom: 1px solid var(--grey-three);
		transition: all 0.2s var(--bezier-one);
	}

	.icon {
		height: 2rem;
	}

	.header-footer {
			gap: 0.25rem;
			display: flex;
			flex-wrap: wrap;
		}

	.attachments {
		margin-top: 1rem;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		.attachments-link {
			text-decoration: none;
		}

		img {
			max-height: 100px;
			width: min-content;
			transition: all 0.2s var(--bezier-one);

			&:hover {
				filter: brightness(1.1);
				transform: translateY(-0.25rem);
			}
		}
	}


	.title-container {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.25rem;
	}

	.header-footer-container {
		flex-wrap: wrap;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;

		.header-footer {
			gap: 0.25rem;
			display: flex;
			background: var(--grey-two);
			flex-wrap: wrap;
			padding: 0.25rem 1rem;
			border-radius: 0.5rem;

			.dot {
				color: var(--white);
			}
		}
	}

	.closed {
		border-bottom: none;
	}

	#arrow {
		height: 1.5rem;
		transition: all 0.2s var(--bezier-one);
		user-select: none;
	}

	.section-container {
		color: var(--grey-five);
		width: 100%;
		border-radius: 20px;
		overflow: hidden;
		border: 1px solid var(--grey-three);
	}

	a {
		display: flex;
		text-decoration: none;
		width: max-content;
		border-radius: 8px;
	}

	.content {
		padding: 1rem 1.25rem;
	}

	a:hover {
		text-decoration: underline var(--accent-color);
		color: var(--white);
	}
	:global(h1),
		:global(h2),
		:global(h3) {
			color: var(--accent-color-two);
		}
		:global(h2) {
			font-size: 1.5rem;
		}

		:global(ul) {
			list-style: none;
		}

		:global(a) {
			color: var(--accent-color-two);
		}
</style>
