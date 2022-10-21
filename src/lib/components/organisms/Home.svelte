<script>
	import Button from '$lib/components/atoms/Button.svelte';
</script>

<section class="hero">
	<div class="hero-text">
		<h1>
			<span>Re</span>Vanced
		</h1>

		<h2>
			An extensible framework for building <br />application mods.
		</h2>

		<div class="hero-buttons">
			<Button icon="download" href="download" maxWidth="true" kind="primary">Download</Button>
			<Button icon="docs" href="docs" maxWidth="true">Read The Docs</Button>
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

	span {
		color: var(--accent-color);
	}

	h1 {
		color: var(--white);
		font-weight: 700;
		font-size: 5rem;
		letter-spacing: -0.04em;
		line-height: 0.75em;
	}

	@media screen and (max-width: 1919px) {
		h1 {
			font-size: 5rem;
		}
	}
	@media screen and (max-width: 1052px) {
		h1 {
			font-size: 4.5rem;
		}
	}
	@media screen and (max-width: 768px) {
		h1 {
			font-size: 4rem;
		}
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
