<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import { queries } from '$data/api';
	import { createQuery } from '@tanstack/svelte-query';

	import Query from '$lib/components/Query.svelte';
	import FooterSection from './FooterSection.svelte';

	const infoQuery = createQuery(['info'], queries.info);
	const socialsQuery = createQuery(['socials'], queries.socials);
</script>

<!-- squiggly divider line -->
<svg
	aria-hidden="true"
	width="100%"
	height="8"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	in:fly={{ y: 10, easing: quintOut, duration: 750 }}
>
	<pattern id="a" width="91" height="8" patternUnits="userSpaceOnUse">
		<path
			d="M114 4c-5.067 4.667-10.133 4.667-15.2 0S88.667-.667 83.6 4 73.467 8.667 68.4 4 58.267-.667 53.2 4 43.067 8.667 38 4 27.867-.667 22.8 4 12.667 8.667 7.6 4-2.533-.667-7.6 4s-10.133 4.667-15.2 0S-32.933-.667-38 4s-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0"
			stroke-linecap="square"
		/>
	</pattern>
	<rect width="100%" height="100%" fill="url(#a)" />
</svg>
<footer in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	<div class="footer-top">
		<section class="main-content">
			<img src="/logo.svg" class="logo-image" alt="ReVanced Logo" />
			<Query query={infoQuery} let:data>
				{#if data}
					<div>
						<p>
							{data.info.about}
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
			<Query query={socialsQuery} let:data>
				{#if data}
					<FooterSection title="Socials">
						{#each data.socials as { name, url }}
							<li>
								<a href={url} target="_blank" rel="noreferrer">{name}</a>
							</li>
						{/each}
					</FooterSection>
				{/if}
			</Query>
		</section>
	</div>
	<Query query={infoQuery} let:data>
		{#if data}
			<div class="footer-bottom">
				<div id="logo-name"><span>Re</span>Vanced</div>
				<a href="/donate"><div>Donate</div></a>
				<a href="mailto:{data.info.contact.email}"><div>Email</div></a>
			</div>
		{/if}
	</Query>
</footer>

<style>
	footer {
		margin: 4rem 0 5rem 0;
		margin-inline: auto;
		padding-bottom: 1rem;
		width: min(87%, 80rem);
	}

	.footer-top {
		display: flex;
		gap: 8rem;
		justify-content: space-between;
		margin-bottom: 4rem;
	}

	.footer-bottom {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	@media screen and (max-width: 768px) {
		.footer-bottom {
			flex-wrap: wrap;
			gap: 1rem;
		}
	}

	#logo-name {
		font-size: 1.4rem;
		color: var(--white);
		font-weight: 600;
	}

	#logo-name span {
		color: var(--accent-color);
	}

	.footer-bottom a {
		text-decoration: none;
		color: var(--grey-five);
		font-weight: 600;
	}

	li {
		list-style: none;
		color: var(--grey-five);
		font-size: 0.9rem;
		font-weight: 500;
	}

	li a {
		color: var(--accent-color);
		font-weight: 600;
		font-size: 0.95rem;
	}

	path {
		stroke: var(--grey-three);
	}

	.main-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: flex-start;
	}

	img {
		height: 2.5rem;
	}

	a {
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline var(--accent-color-two);
		color: var(--white);
	}

	.links-container {
		display: flex;
		gap: 10rem;
		margin-top: 1rem;
	}

	@media screen and (max-width: 1050px) {
		.footer-top {
			flex-direction: column;
			gap: 2rem;
		}

		.links-container {
			display: grid;
			gap: 2rem;
			grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
		}
	}

	@media screen and (max-width: 768px) {
		.links-container {
			display: flex;
			flex-direction: column;
			gap: initial;
		}
	}

	svg {
		padding-left: 15px;
		padding-right: 15px;
	}
</style>
