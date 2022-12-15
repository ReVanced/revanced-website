<script>
	import Button from '$lib/components/atoms/Button.svelte';
</script>

<section class="hero">
	<div class="hero-text">
		<h1>
			<span>Re</span>vemched
		</h1>

		<h4>
			ReVanced is an extensible framework for building <br /> Android applications.
		</h4>

		<div class="hero-buttons">
			<Button icon="download" href="download" kind="primary">Download Manager</Button>
			<Button icon="docs" href="patches">View patches</Button>
		</div>
	</div>
</section>

<style>
	h1 {
		color: var(--white);
		line-height: 1em;
		font-size: 5rem;
		font-weight: 700;
	}

	h4 {
		margin-top: 1rem;
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
			text-align: center;
		}

		h1 {
			font-size: clamp(3rem, 10vw, 4.5rem);
		}

		h4 {
			font-size: clamp(1rem, 1.2rem, 1.5rem);
		}

		br {
			content: ' ';
		}

		.hero-buttons {
			justify-content: center;
		}
	}

	@media screen and (max-width: 600px) {
		.hero-buttons {
			flex-direction: column;
			align-items: center;
		}
	}
</style>
