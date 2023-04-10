<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import type { LogoResult } from '$lib/types';
	import LogoResultOption from '$lib/components/atoms/LogoResultOption.svelte';

	// afn please don't do this lol this is shitty code
	let logos: LogoResult[] = [];
	let transitionDirection = 5;

	// you will never see shittier code tm
	// will refactor later maybe idk
	// Reply: don't think we need to refactor because nobody cares if this code is shit lol
	onMount(async () => {
		const response = await fetch('http://localhost:5174/results');
		logos = await response.json();
        
	});
</script>

<svelte:head>
	<title>ReVanced · Logo Poll</title>
	<meta content="ReVanced · Logo Poll" name="og:title" />
	<meta content="ReVanced · Logo Poll" name="twitter:title" />
</svelte:head>

<main>
	<div class="wrapper">
		<div class="top-container">
			<div class="top-container-text">
				<h3>ReVanced</h3>
				<h1>{'Poll results'}</h1>
			</div>
		</div>

		<div class="options-grid">
			{#each logos as logo}
				<span in:fly={{ x: transitionDirection, easing: expoOut, duration: 1000 }}>
					<LogoResultOption
						logoUrl={logo.optimized_direct_url ?? logo.logo_direct_url}
						votes={logo.votes}
					/>
				</span>
			{/each}
		</div>
	</div>
</main>

<style>
	.options-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 3rem;
	}

	h1 {
		font-size: 2rem;
		color: var(--white);
	}

	h3 {
		color: var(--white);
		margin-bottom: -0.5rem;
	}

	@media screen and (orientation: landscape) and (min-width: 1500px) and (min-height: 950px) {
		:global(.wrapper) {
			padding-bottom: 0;
		}
	}

	.top-container {
		margin-bottom: 2rem;
		background-color: var(--accent-color);
		padding: 2rem;
		border-radius: 20px;
		display: flex;
		justify-content: space-between;
	}

	.top-container-text {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	@media screen and (max-width: 768px) {
		h1 {
			font-size: 1.75rem;
		}
		.options-grid {
			/* The magic number, teef */
			grid-template-columns: repeat(auto-fill, minmax(16.628645896rem, 1fr));
		}
	}
</style>
