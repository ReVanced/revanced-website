<script>
	import Button from '$lib/components/Button.svelte';
</script>

<section class="hero">
	<div class="hero-text">
		<h1>Continuing the <br />legacy of <span>Vanced.</span></h1>
		<p>
			Customize your mobile experience through ReVanced <br /> by applying patches to your applications.
		</p>
		<div class="hero-buttons">
			<Button icon="download" type="filled" href="download">Download</Button>
			<Button icon="docs" type="tonal" href="patches">View patches</Button>
		</div>
	</div>
</section>

<style>
	h1 {
		color: var(--text-one);
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
		color: var(--primary);
	}

	@media (max-width: 767px) {
		.hero {
			padding-bottom: 0;
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
