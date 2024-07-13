<script>
	import SocialButton from './SocialButton.svelte';
	import { queries } from '$data/api';
	import { createQuery } from '@tanstack/svelte-query';
	import Query from '$lib/components/Query.svelte';

	const aboutQuery = createQuery(['about'], queries.about);
</script>

<div class="social-host">
	<Query query={aboutQuery} let:data>
		{#if data}
			{#each data.about.socials.filter((s) => s.name != 'Website') as social}
				<SocialButton {social} />
			{/each}
		{/if}
	</Query>
</div>

<style>
	.social-host {
		width: min(87%, 100rem);
		padding: 0 max(6.5%, calc(50vw - 50rem));
		align-items: center;
		user-select: none;
		display: flex;
		gap: 1rem;
	}

	@media screen and (max-width: 767px) {
		.social-host {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
		}
	}
</style>
