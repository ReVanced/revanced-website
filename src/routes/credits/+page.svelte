<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import ContributorHost from '$lib/components/molecules/ContributorHost.svelte';
	import Footer from '$lib/components/molecules/Footer.svelte';

  // Handled by `+layout.ts`.
  import { contributors } from '../../data/api';

  import type { PageData } from './$types';
  export let data: PageData;
</script>

<main>
	<div class="wrapper">
		<div class="text-container" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
			<h1>Made possible by the community.</h1>
			<h2>Want to show up here? <span><a href="https://github.com/revanced" target="_blank" rel="noreferrer">Become a contributor</a></span></h2>
		</div>
		<div class="contrib-grid">
			{#each $contributors.repositories as { contributors: contribs, name }}
				<div in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
					<ContributorHost {contribs} repo={name} />
				</div>
			{/each}
		</div>
	</div>
</main>

<Footer {...data} />

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
