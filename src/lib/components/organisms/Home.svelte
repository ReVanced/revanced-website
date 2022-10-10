<script>
	import Button from '$lib/components/atoms/Button.svelte';
	import HeroTitle from '../atoms/HeroTitle.svelte';
</script>

<section class="hero">
	<div class="hero-text">
		<!-- <img class="hero-img" src="/manager.png" alt="Screenshot of ReVanced Manager" /> -->
		<HeroTitle />
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
	
	.hero-text { 
		align-items: center;
	}

	.hero-buttons {
		display: flex;
		user-select: none;
		gap: 1rem;
	}

	@media (max-width: 768px) {
		.hero {
			padding-bottom: 0;
			text-align: center;
		}

		h2 {
			font-size: 1.5rem;
		}

		br {
			content: ' ';
		}
		
		.hero-buttons {
			flex-direction: column;
		}
		
	}
	
</style>
