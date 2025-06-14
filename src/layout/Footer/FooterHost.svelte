<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import { queries } from '$data/api';
	import { createQuery } from '@tanstack/svelte-query';

	import Query from '$lib/components/Query.svelte';
	import FooterSection from './FooterSection.svelte';
	import { RV_DMCA_GUID } from '$env/static/public';
	import { onMount } from 'svelte';
	import Divider from '$lib/components/Divider.svelte';

	const aboutQuery = createQuery(queries.about());

	let location: string;

	onMount(() => {
		// DMCA Protection Badge
		location = document.location.href;
	});
</script>

<Divider horizontalPadding={'15px'} />
<footer in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	<div class="top">
		<section class="main-content">
			<img src="/logo.svg" class="logo-image" alt="ReVanced Logo" />
			<Query query={aboutQuery} let:data>
				{#if data}
					<div>
						<p>
							{data.about.about}
						</p>
					</div>
				{/if}
			</Query>
		</section>

		<section class="links-container">
			<FooterSection title="Pages">
				<li><a href="/">Home</a></li>
				<li><a href="/download">Download</a></li>
				<li><a href="/patches">Patches</a></li>
				<li><a href="/contributors">Contributors</a></li>
				<li><a href="/donate">Donate</a></li>
			</FooterSection>
			<Query query={aboutQuery} let:data>
				{#if data}
					<FooterSection title="Socials">
						{#each data.about.socials as { name, url }}
							<li>
								<a href={url} target="_blank" rel="noreferrer">{name}</a>
							</li>
						{/each}
					</FooterSection>
				{/if}
			</Query>
		</section>
	</div>

	<div class="bottom">
		<div id="logo-name"><span>Re</span>Vanced</div>
		<a href="/donate"><div>Donate</div></a>
		<Query query={aboutQuery} let:data>
			{#if data}
				<a href="mailto:{data.about.contact.email}"><div>Email</div></a>
			{/if}
		</Query>
		<!-- DMCA Protection Badge -->
		<a
			href="//www.dmca.com/Protection/Status.aspx?ID={RV_DMCA_GUID}&refurl={location}"
			title="DMCA.com Protection Status"
			class="dmca-badge"
		>
			<img
				src="https://images.dmca.com/Badges/dmca-badge-w150-5x1-08.png?ID={RV_DMCA_GUID}"
				alt="DMCA.com Protection Status"
			/>
		</a>
	</div>
</footer>

<style lang="scss">
	footer {
		background-color: var(--background-one);
		max-width: min(87%, 100rem);
		padding: 5rem 0rem;
		margin: 0 auto;

		.top {
			display: flex;
			gap: 8rem;
			justify-content: space-between;
			margin-bottom: 4rem;

			@media (max-width: 1050px) {
				flex-direction: column;
				gap: 2rem;
			}
		}

		.bottom {
			display: flex;
			gap: 2rem;
			align-items: center;

			a {
				text-decoration: none;
				color: var(--text-four);
				font-weight: 600;
			}

			@media (max-width: 768px) {
				flex-wrap: wrap;
				gap: 1rem;
			}
		}
	}

	.dmca-badge {
		display: flex;
		align-items: center;
	}

	#logo-name {
		font-size: 1.4rem;
		color: var(--text-one);
		font-weight: 600;

		span {
			color: var(--primary);
		}
	}

	li {
		list-style: none;
		color: var(--text-four);
		font-size: 0.9rem;
		font-weight: 500;

		a {
			color: var(--primary);
			font-weight: 600;
			font-size: 0.95rem;
		}
	}

	.main-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: flex-start;
	}

	.logo-image {
		height: 2.5rem;
	}

	a {
		text-decoration: none;

		&:hover {
			text-decoration: underline var(--secondary);
			color: var(--text-one);
		}
	}

	.links-container {
		display: flex;
		gap: 10rem;
		margin-top: 1rem;

		@media (max-width: 1050px) {
			display: grid;
			gap: 2rem;
			grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
		}

		@media (max-width: 768px) {
			display: flex;
			flex-direction: column;
			gap: initial;
		}
	}
</style>
