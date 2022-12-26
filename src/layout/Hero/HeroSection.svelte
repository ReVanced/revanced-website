<script>
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import Button from '$lib/components/Button.svelte';
</script>

<section class="hero">
	<div class="hero-text">
		<h1>Continuing the <br />legacy of <span>Vanced.</span></h1>
		<p>
			Customize your mobile experience through ReVanced <br /> by applying patches to your applications.
		</p>
		<div class="hero-buttons">
			<Button icon="download" kind="primary" href="download">Download Manager</Button>
			<Button icon="docs" href="patches">View patches</Button>
		</div>
	</div>
</section>

<style>
	h1 {
		color: var(--white);
		margin-bottom: 1.5rem;
	}

	p {
		margin-bottom: 2rem;
	}

	.hero {
		padding-bottom: 9rem;
	}

	.hero-text {
		align-items: center;
	}

	.hero-buttons {
		display: flex;
		user-select: none;
		gap: 1rem;
	}

	span {
		color: var(--accent-color);
	}

	@media (max-width: 768px) {
		.hero {
			padding-bottom: 0;
		}

		h4 {
			font-size: clamp(1rem, 1.2rem, 1.5rem);
		}

		br {
			content: ' ';
		}
	}

	@media screen and (max-width: 450px) {
		.hero-buttons {
			flex-direction: column;
		}
	}
</style>
