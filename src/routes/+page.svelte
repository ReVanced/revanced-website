<script lang="ts">
	import HeroImage from '$layout/hero/HeroImage.svelte';
	import Home from '$layout/hero/HeroSection.svelte';
	import Head from '$lib/components/Head.svelte';
	import Wave from '$lib/components/Wave.svelte';
	import { homeSchema } from '$data/seo';

	let bottomVisibility = $state(true);
	let waveElement = $state<SVGElement>();

	const checkVisibility = () => {
		bottomVisibility = !(waveElement && waveElement.getBoundingClientRect().bottom < window.innerHeight - 1);
	};

	$effect(() => {
		checkVisibility(); // Initial check
	});
</script>

<Head schemas={homeSchema} />

<svelte:window onscroll={checkVisibility} onresize={checkVisibility} />

<main class:visibility={!bottomVisibility}>
	<div class="content">
		<Home socialsVisibility={bottomVisibility} />
		<div class="hero-img-container">
			<HeroImage />
		</div>
	</div>
</main>
<Wave visibility={bottomVisibility} bind:waveElement />

<style lang="scss">
	.content {
		display: flex;
		align-items: flex-start;
		justify-content: space-evenly;
		width: min(87%, 80rem);
		gap: 1rem;
	}
	main {
		overflow: hidden;
		padding: 5rem 0;
		min-height: max(100vh, 600px);
		display: flex;
		flex-direction: column;
		align-items: center;

		@media (max-height: 600px), (max-width: 450px) and (max-height: 780px) {
			min-height: initial;
		}

		@media (max-width: 335px) {
			padding: 2rem 0 !important;
		}

		&.visibility {
			min-height: initial;
		}
	}

	.hero-img-container {
		z-index: 0;

		@media (max-width: 1100px) {
			display: none;
		}
	}
</style>
