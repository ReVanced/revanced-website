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
			<h1>Made possible by the community.</h1>
			<h2>Want to show up here? <span><a href="https://github.com/revanced" target="_blank" rel="noreferrer">Become a contributor</a></span></h2>
		</div>
		<div class="contrib-grid">
			{#each $repositories as { contributors: contribs, name }}
				<div in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
					<ContributorHost {contribs} repo={name} />
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

	h1 {
		font-size: 2.25rem;
		font-weight: 600;
		text-align: center;
		color: var(--grey-four);
	}
	h2 {
		font-size: 1rem;
		color: var(--grey-four);
	}

	.text-container {
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 2rem;
		background-color: var(--accent-color);
		padding: 2rem;
		border-radius: 8px;
	}

	a {
		text-decoration: none;
		color: var(--grey-four);
	}

	a::after {
		padding-left: 5px;
		content: '->';
		position: absolute;
		transition: all 0.3s var(--bezier-one);
	}

	a:hover::after {
		transform: translateX(5px);
	}
</style>
