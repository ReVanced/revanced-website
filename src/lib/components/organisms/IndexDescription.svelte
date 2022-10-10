<script>
	import Button from '$lib/components/atoms/Button.svelte';
	import IndexHeroTitle from '../atoms/IndexHeroTitle.svelte';
</script>

<section class="hero">
	<div class="hero-text">
		<!-- <img class="hero-img" src="/manager.png" alt="Screenshot of ReVanced Manager" /> -->
		<IndexHeroTitle />
		<h2>
			An extensible framework for building <br />application mods.
		</h2>

		<div class="hero-buttons">
			<Button icon="download" kind="primary" href="download" fontsize="1.2rem">Download</Button>
			<Button icon="docs" href="docs" fontsize="1.2rem" >Read The Docs</Button>
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
		display: flex;
		user-select: none;
		gap: 1rem;
	}

	.hero-text h1 {
		font-size: 6.5rem;
		letter-spacing: -0.04em;
	}
</style>
