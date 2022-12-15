<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import ContributorHost from '$lib/components/molecules/ContributorHost.svelte';
	import Footer from '$lib/components/molecules/Footer.svelte';

  import { repositories } from '../../data/api';
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
			<h4>Want to show up here? <span><a href="https://github.com/revanced" target="_blank" rel="noreferrer">Become a contributor</a></span></h4>
		</div>
		<div class="contrib-grid">
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
	.contrib-grid {
		display: flex;
		flex-direction: column;
		gap: 3rem;
		margin-bottom: 3rem;
	}

	h2 {
		text-align: center;
		color: var(--grey-four);
		margin-bottom: 0.3rem;
	}
	
	h4 {
		color: var(--grey-four);
		text-align: center;
	}

	.text-container {
		display: flex;
		align-items: center;
		flex-direction: column;
		margin-bottom: 2rem;
		background-color: var(--accent-color);
		padding: 2.4rem;
		border-radius: 8px;
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
		h1 {
			font-size: 2rem;
		}
	}
</style>
