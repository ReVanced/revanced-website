<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import type { TeamMember } from '$lib/types';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import Svg from '$lib/components/Svg.svelte';

	export let member: TeamMember;
	export let i: number;

	const transitionOptions = {
		y: 10,
		easing: quintOut,
		duration: 750,
		delay: 50 * i
	};

	const verifiedIconPath =
		'm9.585.52.929.68c.153.112.331.186.518.215l1.138.175a2.678 2.678 0 0 1 2.24 2.24l.174 1.139c.029.187.103.365.215.518l.68.928a2.677 2.677 0 0 1 0 3.17l-.68.928a1.174 1.174 0 0 0-.215.518l-.175 1.138a2.678 2.678 0 0 1-2.241 2.241l-1.138.175a1.17 1.17 0 0 0-.518.215l-.928.68a2.677 2.677 0 0 1-3.17 0l-.928-.68a1.174 1.174 0 0 0-.518-.215L3.83 14.41a2.678 2.678 0 0 1-2.24-2.24l-.175-1.138a1.17 1.17 0 0 0-.215-.518l-.68-.928a2.677 2.677 0 0 1 0-3.17l.68-.928c.112-.153.186-.331.215-.518l.175-1.14a2.678 2.678 0 0 1 2.24-2.24l1.139-.175c.187-.029.365-.103.518-.215l.928-.68a2.677 2.677 0 0 1 3.17 0ZM7.303 1.728l-.927.68a2.67 2.67 0 0 1-1.18.489l-1.137.174a1.179 1.179 0 0 0-.987.987l-.174 1.136a2.677 2.677 0 0 1-.489 1.18l-.68.928a1.18 1.18 0 0 0 0 1.394l.68.927c.256.348.424.753.489 1.18l.174 1.137c.078.509.478.909.987.987l1.136.174a2.67 2.67 0 0 1 1.18.489l.928.68c.414.305.979.305 1.394 0l.927-.68a2.67 2.67 0 0 1 1.18-.489l1.137-.174a1.18 1.18 0 0 0 .987-.987l.174-1.136a2.67 2.67 0 0 1 .489-1.18l.68-.928a1.176 1.176 0 0 0 0-1.394l-.68-.927a2.686 2.686 0 0 1-.489-1.18l-.174-1.137a1.179 1.179 0 0 0-.987-.987l-1.136-.174a2.677 2.677 0 0 1-1.18-.489l-.928-.68a1.176 1.176 0 0 0-1.394 0ZM11.28 6.78l-3.75 3.75a.75.75 0 0 1-1.06 0L4.72 8.78a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L7 8.94l3.22-3.22a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z';
</script>

<div class="member">
	<a href={member.url} rel="noreferrer" target="_blank" in:fly|global={transitionOptions}>
		<img src={member.avatar_url} alt="{member.name}'s profile picture." />
	</a>
	<div class="member-text">
		<div class="member-title">
			<a href={member.url} rel="noreferrer" target="_blank" in:fly|global={transitionOptions}>
				<h4>{member.name}</h4>
			</a>
			<div class="verified-badge">
				<Tooltip
					content="<p><b>{member.name}</b> is verified with this GPG Key ID:</p> <a class='gpg-url' href={member
						.gpg_key.url} rel='noreferrer' target='_blank'>{member.gpg_key.id}</a>"
					html={true}
				>
					<div class="desktop-verified">
						<a href={member.gpg_key.url} rel="noreferrer" target="_blank">
							<Svg svgHeight={16} viewBoxHeight={16}>
								<path d={verifiedIconPath} />
							</Svg>
						</a>
					</div>
					<div class="mobile-verified">
						<Svg svgHeight={16} viewBoxHeight={16}>
							<path d={verifiedIconPath} />
						</Svg>
						<h5>Verified</h5>
					</div>
				</Tooltip>
			</div>
		</div>
		{#if member.bio}
			<h6>{member.bio}</h6>
		{/if}
	</div>
</div>

<style lang="scss">
	a {
		text-decoration: none;
	}

	.member {
		width: 100%;
		color: var(--text-one);
		border: 1px solid var(--border);
		padding: 1rem;
		border-radius: 12px;
		display: flex;
		gap: 1rem;
		transition: 0.3s background-color var(--bezier-one);

		&:hover {
			background-color: var(--surface-seven);
		}
	}

	.member-text {
		display: flex;
		flex-direction: column;
		word-break: break-word;

		.member-title {
			display: flex;
			align-items: center;
			gap: 0.5rem;

			.verified-badge {
				display: flex;
				align-items: center;
				fill: var(--secondary);
				line-height: 16px;
				height: 16px;

				.mobile-verified {
					display: none;
				}
				@media screen and (width <= 768px) {
					.desktop-verified {
						display: none;
					}
					.mobile-verified {
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						gap: 0.25rem;
					}
				}
			}
		}
	}

	img {
		border-radius: 50%;
		height: 64px;
		width: 64px;
		transition: transform 0.4s var(--bezier-one);
		user-select: none;
		margin-bottom: 1rem;

		@media screen and (max-width: 768px) {
			margin-bottom: 0;
			height: 48px;
			width: 48px;
		}
	}
</style>
