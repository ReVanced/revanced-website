<script>
	import Button from '$lib/components/atoms/Button.svelte';
</script>

<section class="hero">
	<div class="hero-text">
		<h5>ANDROID APP PATCHER</h5>
		<h1>
			Continuing the <br />legacy of <span>Vanced.</span>
		</h1>
		<h4>
			Customize your mobile experience through ReVanced <br /> by applying patches to your applications.
		</h4>

		<div class="hero-buttons">
			<Button icon="download" kind="primary" capitalize={true} href="download"
				>Download Manager</Button
			>
			<Button icon="docs" href="patches" capitalize={true}>View patches</Button>
		</div>
	</div>
</section>

<style>
	h1 {
		color: var(--white);
		font-weight: 700;
		margin-bottom: 1.5rem;
	}

	h5 {
		margin-bottom: 0.5rem;
	}
	h4 {
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

		h1 {
			font-size: clamp(3rem, 10vw, 3rem);
		}

		h4 {
			font-size: clamp(1rem, 1.2rem, 1.5rem);
		}

		br {
			content: ' ';
		}
	}

	@media screen and (max-width: 600px) {
		.hero-buttons {
			flex-direction: column;
		}
	}
</style>
