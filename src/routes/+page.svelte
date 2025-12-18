<script lang="ts">
	import { onMount } from 'svelte';
	import Page from '$components/molecules/Page.svelte';
	import Button from '$components/atoms/Button.svelte';
	import SocialButton from '$components/molecules/SocialButton.svelte';
	import WaveBackground from '$components/organisms/WaveBackground.svelte';
	import { aboutQuery } from '$stores';
	import managerImg from '$assets/icons/manager.png';
	import Download from 'virtual:icons/material-symbols/download';
	import Description from 'virtual:icons/material-symbols/description-outline';

	let socials = $derived(aboutQuery.data?.socials ?? []);
	let filteredSocials = $derived(socials.filter((s) => s.name !== 'Website'));
	
	let bottomVisibility = $state(true);

	function checkVisibility() {
		const footerSocials = document.getElementById('footer-socials');
		if (footerSocials) {
			const rect = footerSocials.getBoundingClientRect();
			bottomVisibility = rect.top > window.innerHeight;
		}
	}

	onMount(() => {
		checkVisibility();
	});

	const schemas = [
		{
			'@context': 'https://schema.org',
			'@type': 'Organization',
			url: 'https://revanced.app/',
			logo: 'https://revanced.app/logo.png'
		},
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Home',
					item: 'https://revanced.app/'
				}
			]
		},
		{
			'@context': 'https://schema.org',
			'@type': 'FAQPage',
			mainEntity: [
				{
					'@type': 'Question',
					name: 'What is ReVanced?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'ReVanced is an <b>open-source patcher</b> for <b>Android apps</b>. With ReVanced we <b>continue the legacy of Vanced</b>.'
					}
				},
				{
					'@type': 'Question',
					name: 'How to get ReVanced?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'You can follow <a href="https://github.com/revanced/revanced-manager/tree/main/docs">ReVanced Manager documentation</a> to use <b>ReVanced Manager</b> or the <a href="https://github.com/revanced/revanced-cli/tree/main/docs">ReVanced CLI documentation</a> to use <b>ReVanced CLI</b>.'
					}
				},
				{
					'@type': 'Question',
					name: 'How does it work?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'ReVanced uses a technique called <b>patching</b>. It patches <b>your choice of an app</b> and adds <b>new features</b> to it. Thanks to the <b>modularity of ReVanced</b>, you can choose <b>any combination of features you want</b> to use.'
					}
				},
				{
					'@type': 'Question',
					name: 'Does ReVanced support non-rooted devices?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: '<b>Yes</b>! ReVanced supports <b>non-root and rooted devices</b>.'
					}
				},
				{
					'@type': 'Question',
					name: 'Is ReVanced affiliated with Vanced?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'ReVanced is <b>not affiliated</b> with Vanced.'
					}
				},
				{
					'@type': 'Question',
					name: 'How can I help?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'Since we are an <b>open-source community</b> and depend on outside help, you can always check out our <a href="https://github.com/revanced">GitHub repositories</a> and <b>contribute to ReVanced</b> by creating an issue or pull requests.'
					}
				}
			]
		},
		{
			'@context': 'https://schema.org',
			'@type': 'SoftwareApplication',
			name: 'ReVanced Manager',
			operatingSystem: 'ANDROID',
			applicationCategory: 'UtilitiesApplication',
			aggregateRating: {
				'@type': 'AggregateRating',
				ratingValue: '4.0',
				ratingCount: '100'
			},
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: 'USD'
			}
		},
		{
			'@context': 'https://schema.org',
			'@type': 'SoftwareApplication',
			name: 'ReVanced CLI',
			operatingSystem: 'All',
			applicationCategory: 'UtilitiesApplication',
			aggregateRating: {
				'@type': 'AggregateRating',
				ratingValue: '4.0',
				ratingCount: '30'
			},
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: 'USD'
			}
		}
	];
</script>

<svelte:head>
	{#each schemas as schema}
		{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
	{/each}
</svelte:head>

<svelte:window onscroll={checkVisibility} onresize={checkVisibility} />

<Page>
	<main class:visibility={!bottomVisibility}>
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
					class:hidden={!bottomVisibility}
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

		<WaveBackground visibility={bottomVisibility} />
	</main>
</Page>

<style>
	main {
		min-height: max(100vh, 600px);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		padding: 5rem 2rem;
	}

	main.visibility {
		min-height: initial;
	}

	@media (max-height: 600px), (max-width: 450px) and (max-height: 780px) {
		main {
			min-height: initial;
		}
	}

	@media (max-width: 335px) {
		main {
			padding: 2rem 0 !important;
		}
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

	@media (max-width: 1100px) {
		.phone-showcase {
			display: none;
		}
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

	@media (min-width: 901px) and (min-height: 601px) {
		.social-buttons:not(.hidden) {
			position: absolute;
			bottom: 1rem;
		}
	}

	@media (max-width: 450px) {
		.social-buttons:not(.hidden) {
			justify-content: center;
			left: 0;
		}
	}

	@media (max-height: 600px), (max-width: 450px) and (max-height: 780px) {
		.social-buttons {
			position: static !important;
			opacity: 1 !important;
			transform: none !important;
		}
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
