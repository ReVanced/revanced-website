<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { TeamMember } from '$api';
	import IconVerified from 'virtual:icons/material-symbols/verified';
	import ToolTip from '$components/atoms/ToolTip.svelte';

	type Props = {
		member: TeamMember;
		i?: number;
	};

	let { member, i = 0 }: Props = $props();

	let transitionOptions = $derived({
		y: 10,
		easing: quintOut,
		duration: 750,
		delay: 50 * i
	});
</script>

<div class="member" in:fly={transitionOptions}>
	<a href={member.url} rel="noreferrer" target="_blank" class="avatar-link">
		<img src={member.avatar_url} alt="{member.name}'s profile picture" loading="lazy" />
	</a>
	<div class="member-text">
		<div class="member-title">
			<a href={member.url} rel="noreferrer" target="_blank" class="name-link">
				<h4>{member.name}</h4>
			</a>
			{#if member.gpg_key}
				{@const gpgKey = member.gpg_key}
				<div class="verified-badge">
					<ToolTip interactive>
						{#snippet children()}
							<a href={gpgKey.url} rel="noreferrer" target="_blank" class="badge-link desktop">
								<IconVerified />
							</a>
							<span class="badge-mobile mobile">
								<IconVerified />
								<span class="gpg-label">GPG key</span>
							</span>
						{/snippet}
						{#snippet tooltipContent()}
							<p>GPG key ID:</p>
							<a href={gpgKey.url} rel="noreferrer" target="_blank" class="gpg-url">
								{gpgKey.id}
							</a>
						{/snippet}
					</ToolTip>
				</div>
			{/if}
		</div>
		{#if member.bio}
			<h6 class="bio">{member.bio}</h6>
		{/if}
	</div>
</div>

<style>
	.member {
		width: 100%;
		color: var(--text-one);
		border: 1px solid var(--border);
		padding: 1rem;
		border-radius: 12px;
		display: flex;
		gap: 1rem;
		transition: background-color 0.3s var(--bezier-one);
	}

	.member:hover {
		background-color: var(--surface-seven);
	}

	.avatar-link {
		flex-shrink: 0;
	}

	img {
		border-radius: 50%;
		height: 64px;
		width: 64px;
		transition: transform 0.4s var(--bezier-one);
		user-select: none;
		object-fit: cover;
		background-color: var(--surface-four);
	}

	.member-text {
		display: flex;
		flex-direction: column;
		word-break: break-word;
		min-width: 0;
	}

	.member-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.name-link {
		text-decoration: none;
		color: var(--text-one);
	}

	.name-link:hover {
		text-decoration: underline var(--primary);
	}

	.name-link h4 {
		margin: 0;
	}

	.verified-badge {
		display: flex;
		align-items: center;
	}

	.badge-link,
	.badge-mobile {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		color: var(--secondary);
		text-decoration: none;
		line-height: 1;
	}

	.badge-link:hover,
	.badge-mobile:hover {
		color: var(--primary);
	}

	.badge-link :global(svg),
	.badge-mobile :global(svg) {
		width: 20px;
		height: 20px;
	}

	.gpg-label {
		font-size: 0.8rem;
		font-weight: 500;
	}

	.desktop {
		display: inline-flex;
	}

	.mobile {
		display: none;
	}

	.gpg-url {
		color: var(--primary);
		text-decoration: none;
		font-family: monospace;
		font-size: 13px;
	}

	.gpg-url:hover {
		text-decoration: underline;
	}

	.bio {
		color: var(--text-four);
		margin: 0;
		margin-top: 0.25rem;
	}

	@media (max-width: 768px) {
		img {
			height: 48px;
			width: 48px;
		}

		.desktop {
			display: none;
		}

		.mobile {
			display: inline-flex;
		}
	}
</style>
