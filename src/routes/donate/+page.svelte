<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import { queries } from '$data/api';
	import { createQuery } from '@tanstack/svelte-query';

	import Head from '$lib/components/Head.svelte';
	import Query from '$lib/components/Query.svelte';
	import CryptoDialog from '$layout/Dialogs/CryptoDialog.svelte';

	import DonateHeartAnimation from './DonateHeartAnimation.svelte';
	import TeamMember from './TeamMember.svelte';

	import { supportsWebP } from '$util/supportsWebP';

	const teamQuery = createQuery(queries.team());
	const aboutQuery = createQuery(queries.about());

	let cryptoDialogue = false;

	const shuffle = <T,>(array: T[]) =>
		array
			.map((value) => ({ value, sort: Math.random() }))
			.sort((a, b) => a.sort - b.sort)
			.map(({ value }) => value);
</script>

<Head
	title="Donate to ReVanced"
	description="Donate to ReVanced with a variety of donation methods, including cryptocurrencies in order to allow us to maintain our servers and develop new features."
	schemas={[
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Home',
					item: 'https://revanced.app/'
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Download',
					item: 'https://revanced.app/donate'
				}
			]
		}
	]}
/>

<main class="wrapper" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	<section>
		<div>
			<h2>🎉 Support <span style="color: var(--primary);">ReVanced</span></h2>
			<p>
				ReVanced offers a variety of patches, including ad-blocking, custom themes, and innovative
				features. All of which is completely open source and free of charge. Donating will allow
				ReVanced maintain our servers and develop new features.
			</p>
		</div>
		<div id="heart">
			<DonateHeartAnimation
				backgroundImageUrl="/revanced-logo-background.svg"
				foregroundImageUrl="/icons/heart.svg"
				alt="ReVanced Logo"
			/>
		</div>
	</section>
	<h3>Donate</h3>
	<Query query={aboutQuery} let:data>
		<div class="donate-cards">
			{#if data.about.donations.links}
				{#each data.about.donations.links as link}
					<a class="donate-card" target="_blank" rel="noreferrer" href={link.url}>
						<!-- not using <img/> because we want the image height to always be 200px -->
						<div
							style="background-image: url('/donate/card-images/{link.name}.{supportsWebP()
								? 'webp'
								: 'png'}'), url('/donate/card-images/fallback.svg');"
							role="img"
							aria-label="{link.name} preview image"
						/>
						<span>{link.name}</span>
					</a>
				{/each}
			{/if}
			{#if data.about.donations.wallets}
				<button class="donate-card" on:click={() => (cryptoDialogue = !cryptoDialogue)}>
					<div
						style="background-image: url('/donate/card-images/Cryptocurrencies.{supportsWebP()
							? 'webp'
							: 'png'}'), url('/donate/card-images/fallback.svg');"
						role="img"
						aria-label="Cryptocurrencies preview image"
					/>
					<span>Cryptocurrencies</span>
				</button>
			{/if}
		</div>
	</Query>
	<Query query={teamQuery} let:data>
		<h3>Meet the team</h3>
		{#if data.members.length > 0}
			<section class="team">
				<!-- randomize team members because equality -->
				{#each shuffle(data.members) as member, i}
					<TeamMember {member} {i} />
				{/each}
			</section>
		{/if}
	</Query>
</main>

<Query query={aboutQuery} let:data>
	<CryptoDialog bind:dialogOpen={cryptoDialogue} wallets={data.about.donations.wallets} />
</Query>

<style lang="scss">
	main {
		display: flex;
		flex-direction: column;
		margin-bottom: 5rem;

		section {
			display: flex;
			justify-content: center;
			align-items: center;

			@media (max-width: 768px) {
				flex-direction: column-reverse;
			}
		}
	}

	h2 {
		margin-bottom: 0.5rem;
		color: var(--text-one);
	}

	h3 {
		margin-bottom: 1.5rem;
	}

	p {
		margin-bottom: 2rem;
		width: 60%;

		@media (max-width: 1200px) {
			width: 90%;
		}

		@media (max-width: 768px) {
			width: 100%;
		}
	}

	@media (max-width: 768px) {
		#heart {
			display: none;
		}
	}

	.donate-cards {
		display: flex;
		gap: 1rem;
		margin-bottom: 3rem;

		@media (max-width: 768px) {
			flex-direction: column;
		}
	}

	.donate-card {
		text-decoration: none;
		background-color: var(--surface-nine);
		border-radius: 1.5rem;
		width: 100%;
		cursor: pointer;
		text-align: left;
		border: none;
		overflow: hidden;
		transition:
			0.3s border-radius var(--bezier-one),
			0.3s background-color var(--bezier-one);

		&:hover {
			background-color: var(--tertiary);
		}

		&:active {
			border-radius: 2.75rem;
		}

		span {
			display: block;
			color: var(--text-four);
			font-size: 1.05rem;
			font-weight: 500;
			padding: 1.5rem;
		}

		div {
			height: 200px;
			background-size: cover;
			background-position: center;
			max-width: 100%;
		}
	}

	.team {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(325px, 1fr));
		justify-content: space-between;
		align-items: stretch;
		gap: 1rem;
	}
</style>
