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

<div class="announcement" id={`announcment-${announcement.id}`}>
	<div class="header">
		<div class="title-container">
			<img src="/icons/{icon}.svg" alt="announcement" />
			<h2>{announcement.title}</h2>
		</div>
		<div class="header-footer-container">
			<div class="header-footer">
				<p>{announcement.channel}</p>
			</div>
			<div class="header-footer">
				<p>{diffDays}</p>
				{#if announcement.author}
					<p class="dot">•</p>
					<p>{announcement.author}</p>
				{/if}
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
	.announcement {
		border-radius: 1.5rem;
		background-color: var(--grey-six);
		display: flex;
		width: 100%;
		flex-direction: column;
		color: var(--grey-five);
		transition: all 0.2s var(--bezier-one);

		&:hover {
			transform: translateY(-0.25rem);
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

		.content {
			padding: 2rem;
		}

		.header {
			padding: 1.5rem;
			border-radius: 1.5rem 1.5rem 0 0;
			background-color: var(--grey-one);
			gap: 1rem;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: space-between;

			.header-footer-container {
				flex-wrap: wrap;
				display: flex;
				gap: 1rem;

				.header-footer {
					gap: 0.25rem;
					display: flex;
					background: var(--grey-three);
					flex-wrap: wrap;
					padding: 0.25rem 1rem;
					border-radius: 0.5rem;

					.dot {
						color: var(--white);
					}
				}
			}
		}

		.title-container {
			display: flex;
			flex-wrap: wrap;
			gap: 0.5rem;

			img {
				color: red;
				width: 2rem;
				height: 2rem;
			}
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
	}
</style>
