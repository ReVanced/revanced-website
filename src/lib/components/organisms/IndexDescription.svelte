<script>
	import Button from '$lib/components/atoms/Button.svelte';
	import IndexHeroTitle from '../atoms/IndexHeroTitle.svelte';
</script>

<section class="hero">
	<div class="hero-text">
		<!-- <img class="hero-img" src="/manager.png" alt="Screenshot of ReVanced Manager" /> -->
		<IndexHeroTitle />
		<h2>
			An extensible framework for<br />
			building application mods.
		</h2>

		<div class="hero-buttons">
			<Button kind="primary" href="/download" fontsize="1.3rem">Download</Button>
			<Button href="/docs" fontsize="1.3rem">Read The Docs</Button>
		</div>
	</div>
</section>

<style>
	h2 {
		margin-top: 1.75rem;
		margin-bottom: 2rem;
	}
	.hero {
		padding-bottom: 10rem;
	}
	@media (max-width: 768px) {
		.hero {
			padding-top: 10rem;
			padding-bottom: 0;
			text-align: center;
		}
		h2 {
			font-size: 1.5rem;
		}
		.hero-buttons {
			flex-direction: column;
			gap: 0;
		}
	}
	.hero-text { 
		align-items: center;
	}

	.hero-buttons {
		gap: 1rem;
		display: flex;
		user-select: none;
	}

	.hero-text h1 {
		font-size: 6.5rem;
		letter-spacing: -0.04em;
	}
</style>
