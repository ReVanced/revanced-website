<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import type { TeamMember } from '$lib/types';

	export let member: TeamMember;
	export let i: number;
</script>

<a
	class="member"
	href={member.url}
	rel="noreferrer"
	target="_blank"
	in:fly|global={{ y: 10, easing: quintOut, duration: 750, delay: 50 * i }}
>
	<img src={member.avatar_url} alt="{member.name}'s profile picture." />

	<div class="member-text">
		<h4>{member.name}</h4>
		{#if member.bio}
			<h6>{member.bio}</h6>
		{/if}
	</div>
</a>

<style lang="scss">
	.member {
		width: 100%;
		color: var(--white);
		border: 1px solid var(--grey-three);
		text-decoration: none;
		cursor: pointer;
		padding: 1rem;
		border-radius: 12px;
		display: flex;
		gap: 1rem;
		transition: 0.3s background-color var(--bezier-one);

		&:hover {
			background-color: var(--grey-six);
		}
	}

	.member-text {
		display: flex;
		flex-direction: column;
		word-break: break-word;
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
