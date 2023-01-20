<script>
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import Button from '$lib/components/Button.svelte';
	import HeroImage from './HeroImage.svelte';
</script>

<section class="hero">
	<div class="hero-text">
		<h1><span>Re</span>Vanced</h1>
		<p>
			Customize your mobile experience through ReVanced <br />by applying patches to your
			applications.
		</p>
		<div class="hero-buttons">
			<Button kind="one" href="download">Download Manager</Button>
			<Button kind="four" href="patches">View patches</Button>
		</div>
	</div>
	<HeroImage />
</section>

<style>
	h1 {
		color: var(--white);
		margin-bottom: 0.5rem;
	}

	p {
		margin-bottom: 1.75rem;
	}

	.hero {
		padding-bottom: 10rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.hero-text {
		text-align: center;
		align-items: flex-start;
		margin-bottom: 4rem;
	}

	.hero-buttons {
		justify-content: center;
		display: flex;
		user-select: none;
		--webkit-user-select: none;
		gap: 1rem;
	}

	span {
		color: var(--accent-color);
	}

	@media (max-width: 768px) {
		.hero {
			padding-bottom: 0;
		}
		.hero-text {
			align-items: flex-start;
		}

		h1,
		p {
			text-align: left;
		}

		br {
			content: ' ';
		}
	}

	@media screen and (max-width: 400px) {
		.hero-buttons {
			flex-direction: column;
			gap: 1rem;
		}
	}
</style>
