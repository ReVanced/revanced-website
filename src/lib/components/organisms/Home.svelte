<script>
	import Button from '$lib/components/atoms/Button.svelte';
</script>

<section class="hero">
	<div class="hero-text">
		<h1>
			Nothing <br />apps, <span class="flicker">ad</span><span class="blue">vanced.</span>
		</h1>

		<h2>
			ReVanced is an extensible framework for building <br /> Android application mods.
		</h2>

		<div class="hero-buttons">
			<Button icon="download" href="download" kind="primary">Download Manager</Button>
			<Button icon="docs" href="patches">View Patches</Button>
		</div>
	</div>
</section>

<style>
	h2 {
		margin-top: 1.75\rem;
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

	.blue {
		color: var(--accent-color);
	}

	@keyframes flicker {
		0% {
			color: var(--grey-two);
		}
		10% {
			color: var(--accent-color);
		}
		15% {
			color: var(--grey-two);
		}
		35% {
			color: var(--accent-color);
		}
		45% {
			color: var(--accent-color);
		}
		50% {
			color: var(--grey-two);
		}
		52.5% {
			color: var(--accent-color);
		}
		85% {
			color: var(--accent-color);
		}
		100% {
			color: var(--grey-two);
		}
	}

	.flicker {
		color: var(--accent-color);
		/* animation: flicker 2s forwards;
		animation-timing-function: var(--bezier-one);
		animation-delay: 1.5s;
		animation-iteration-count: 1; */
	}


	h1 {
		line-height: 1em;
		font-size: 4rem;
	}

	@media (max-width: 768px) {
		.hero {
			padding-bottom: 0;
			text-align: center;
		}

		h1 {
			font-size: clamp(2.9rem, 10vw, 4rem);
		}

		h2 {
			font-size: 1.2rem;
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
