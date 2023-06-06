<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import { queries } from '$data/api';
	import { friendlyName } from '$util/friendlyName';

	import { createQuery } from '@tanstack/svelte-query';
	import Query from '$lib/components/Query.svelte';

	const query = createQuery(['repositories'], queries.repositories);
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
		<g clip-path="url(#clip0_2426_11367)">
			<path
				d="M114 4c-5.067 4.667-10.133 4.667-15.2 0S88.667-.667 83.6 4 73.467 8.667 68.4 4 58.267-.667 53.2 4 43.067 8.667 38 4 27.867-.667 22.8 4 12.667 8.667 7.6 4-2.533-.667-7.6 4s-10.133 4.667-15.2 0S-32.933-.667-38 4s-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0"
				stroke-linecap="square"
			/>
		</g>
	</pattern>
	<rect width="100%" height="100%" fill="url(#a)" />
</svg>
<footer in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	<div class="footer-top">
		<section class="main-content">
			<img src="/logo.svg" class="logo-image" alt="ReVanced Logo" />
			<div>
				<p>
					ReVanced was born out of Vanced's discontinuation and it is our goal to continue the
					legacy of what Vanced left behind. Thanks to ReVanced Patcher, it's possible to create
					long-lasting patches for nearly any Android app. ReVanced's patching system is designed to
					allow patches to work on new versions of the apps automatically with bare minimum
					maintenance.
				</p>
			</div>
		</section>

		<section class="links-container">
			<ul>
				<li>Pages</li>
				<li><a href="/">Home</a></li>
				<li><a href="/download">Download</a></li>
				<li><a href="/docs">Documentation</a></li>
				<li><a href="/patches">Patches</a></li>
				<li><a href="/contributors">Contributors</a></li>
			</ul>
			<ul>
				<li>Repositories</li>
				<Query {query} let:data>
					{#each data as { name }}
						<li>
							<a href="https://github.com/{name}" target="_blank" rel="noreferrer">
								{friendlyName(name)}
							</a>
						</li>
					{/each}
				</Query>
			</ul>
			<ul>
				<!-- to replace -->
				<li>Socials</li>
				<li><a href="https://github.com/revanced" target="_blank" rel="noreferrer">GitHub</a></li>
				<li><a href="https://revanced.app/discord" target="_blank" rel="noreferrer">Discord</a></li>
				<li>
					<a href="https://reddit.com/r/revancedapp" target="_blank" rel="noreferrer">Reddit</a>
				</li>
				<li><a href="https://t.me/app_revanced" target="_blank" rel="noreferrer">Telegram</a></li>
				<li>
					<a href="https://twitter.com/revancedapp" target="_blank" rel="noreferrer">Twitter</a>
				</li>
				<li>
					<a href="https://www.youtube.com/c/ReVanced" target="_blank" rel="noreferrer">YouTube</a>
				</li>
			</ul>
		</section>
	</div>
	<div class="footer-bottom">
		<div id="logo-name"><span>Re</span>Vanced</div>
		<a href="https://liberapay.com/ReVanced/donate"><div>Donate</div></a>
		<a href="mailto:contact@revanced.app"><div>Email</div></a>
	</div>
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
		font-weight: 500;
	}

	li {
		list-style: none;
		color: var(--grey-five);
		font-size: 0.9rem;
		font-weight: 500;
	}

	li a {
		color: var(--accent-color);
		font-weight: 500;
		font-size: 0.95rem;
	}

	g path {
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
		display: block;
		padding: 0.5rem 0;
		text-decoration: none;
		transition: all 0.2s ease;
		text-underline-offset: 0rem;
	}

	li:first-of-type {
		padding-bottom: 0.5rem;
	}

	a:hover {
		text-decoration: underline;
		text-decoration-style: wavy;
		text-underline-offset: 0.25rem;
		text-decoration-color: var(--accent-color-two);
		translate: 0.25rem 0;
		color: var(--accent-color-two);
	}

	.links-container {
		display: flex;
		gap: 10rem;
		margin-top: 1rem;
	}

	ul {
		display: flex;
		flex-direction: column;
		width: max-content;
	}

	@media screen and (max-width: 1050px) {
		.footer-top {
			flex-direction: column;
			gap: 2rem;
		}

		.links-container {
			display: grid;
			gap: 3rem;
			grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
		}
	}
</style>
