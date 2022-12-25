<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import { repositories } from '$data/api';

	import ContributorHost from './ContributorSection.svelte';
	import Footer from '$layout/Footer.svelte';
</script>

<svelte:head>
	<title>ReVanced | Contributors</title>
	<meta content="ReVanced | Contributors" name="og:title" />
	<meta content="ReVanced | Contributors" name="twitter:title" />
</svelte:head>

<main>
	<div class="wrapper">
		<div class="text-container" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
			<h2>Made possible by the community.</h2>
			<h4>
				Want to show up here? <span
					><a href="https://github.com/revanced" target="_blank" rel="noreferrer"
						>Become a contributor</a
					></span
				>
			</h4>
		</div>
		<div class="repos">
			{#each $repositories as { contributors, name: repo }}
				<div in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
					<ContributorHost {contributors} {repo} />
				</div>
			{/each}
		</div>
	</div>
</main>

<Footer />

<style>
	.repos {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		margin-bottom: 4rem;
	}

	h2 {
		text-align: center;
		color: var(--grey-four);
		margin-bottom: 0.3rem;
	}

	h4 {
		text-align: center;
		color: var(--grey-four);
	}

	.text-container {
		display: flex;
		align-items: center;
		flex-direction: column;
		margin-bottom: 2rem;
		background-color: var(--accent-color);
		padding: 2.5rem 1.75rem;
		border-radius: 20px;
	}

	a {
		text-decoration: none;
		color: var(--grey-four);
	}

	a::after {
		padding-left: 5px;
		content: '→';
		position: absolute;
		transition: all 0.3s var(--bezier-one);
	}

	a:hover::after {
		transform: translateX(5px);
	}
	@media screen and (max-width: 768px) {
		.text-container {
			margin-bottom: 2rem;
		}
	}
</style>
