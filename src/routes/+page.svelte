<script lang="ts">
	import Page from '$components/molecules/Page.svelte';
	import Button from '$components/atoms/Button.svelte';
	import SocialButton from '$components/molecules/SocialButton.svelte';
	import WaveBackground from '$components/organisms/WaveBackground.svelte';
	import { aboutQuery, footerVisibility } from '$stores';
	import managerImg from '$assets/icons/manager.png';
	import Download from 'virtual:icons/material-symbols/download';
	import Description from 'virtual:icons/material-symbols/description-outline';

	let socials = $derived(aboutQuery.data?.socials ?? []);
	let filteredSocials = $derived(socials.filter((s) => s.name !== 'Website'));
	let heroSocialsVisible = $derived(!footerVisibility.isFooterSocialsVisible);
</script>

<Page>
	<main>
		<section class="hero">
			<div class="hero-content">
				<h1>
					Continuing the<br />legacy of <span class="highlight">Vanced.</span>
				</h1>
				<p class="tagline">
					Customize your mobile experience through ReVanced<br />
					by applying patches to your applications.
				</p>

				<div class="cta-buttons">
					<Button buttonStyle="filled" icon={Download} href="/download">
						Download
					</Button>
					<Button buttonStyle="tonal" icon={Description} href="/patches">
						View patches
					</Button>
				</div>

				<div 
					class="social-buttons"
					class:hidden={!heroSocialsVisible}
				>
					{#each filteredSocials as social (social.name)}
						<SocialButton {social} />
					{/each}
				</div>
			</div>

			<div class="phone-showcase">
				<div class="phone-frame">
					<img src={managerImg} alt="ReVanced Manager" />
				</div>
			</div>
		</section>

		<WaveBackground />
	</main>
</Page>

<style>
	main {
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		padding: 2rem;
	}

	/* Hero section */
	.hero {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4rem;
		width: 100%;
		max-width: 1200px;
	}

	.hero-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		flex: 1;
		max-width: 550px;
	}

	.hero-content h1 {
		font-size: clamp(2.5rem, 5vw, 3.5rem);
		line-height: 1.1;
		font-weight: 700;
		color: var(--text-one);
		letter-spacing: -0.02em;
	}

	.highlight {
		color: var(--primary);
		position: relative;
	}

	.tagline {
		font-size: clamp(1rem, 2vw, 1.15rem);
		line-height: 1.7;
		color: var(--text-four);
	}

	.cta-buttons {
		display: flex;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	/* Phone showcase */
	.phone-showcase {
		position: relative;
		flex-shrink: 0;
	}

	.phone-frame {
		background: var(--surface-seven);
		border-radius: 2rem;
		padding: 0.5rem;
		animation: phone-float 6s ease-in-out infinite;
	}

	@keyframes phone-float {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-12px);
		}
	}

	.phone-frame img {
		display: block;
		height: clamp(400px, 60vh, 550px);
		width: auto;
		border-radius: 1.5rem;
		object-fit: contain;
	}

	/* Social buttons */
	.social-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 0.5rem;
		max-width: 30rem;
		opacity: 1;
		transition: 
			opacity 0.25s var(--bezier-one),
			transform 0.3s var(--bezier-one);
	}

	.social-buttons.hidden {
		opacity: 0;
		transform: translateY(10px);
		pointer-events: none;
	}

	/* Responsive */
	@media (max-width: 900px) {
		.hero {
			flex-direction: column;
			text-align: center;
			gap: 3rem;
		}

		.hero-content {
			align-items: center;
		}

		.tagline br {
			display: none;
		}

		.phone-frame img {
			height: clamp(300px, 45vh, 400px);
		}

		.cta-buttons {
			justify-content: center;
		}

		.social-buttons {
			justify-content: center;
		}
	}

	@media (max-width: 480px) {
		main {
			padding: 1.5rem;
		}

		.cta-buttons {
			flex-direction: column;
			width: 100%;
		}

		.cta-buttons :global(a),
		.cta-buttons :global(button) {
			width: 100%;
		}
}

	@media (max-height: 700px) {
		.phone-frame img {
			height: clamp(250px, 40vh, 350px);
		}
	}
</style>
