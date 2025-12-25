<script lang="ts">
	import { onMount } from 'svelte';
	import Page from '$components/molecules/Page.svelte';
	import Button from '$components/atoms/Button.svelte';
	import SocialButton from '$components/molecules/SocialButton.svelte';
	import WaveBackground from '$components/organisms/WaveBackground.svelte';
	import { aboutQuery } from '$stores';
	import managerImg from '$assets/icons/manager.png';
	import Download from 'svelte-material-icons/TrayArrowDown.svelte';
	import Description from 'svelte-material-icons/FileDocumentOutline.svelte';

	let showSocials = $state(true);
	let rafId: number | null = null;

	let socialLinks = $derived(
		(aboutQuery.data?.socials ?? []).filter((item) => item.name !== 'Website')
	);

	function updateSocialsVisibility() {
		if (rafId !== null) return;
		
		rafId = requestAnimationFrame(() => {
			rafId = null;
			const footerSection = document.getElementById('footer-socials');
			if (!footerSection) {
				showSocials = true;
				return;
			}
			
			const bounds = footerSection.getBoundingClientRect();
			showSocials = bounds.top > window.innerHeight + 50;
		});
	}

	onMount(() => {
		updateSocialsVisibility();
		
		return () => {
			if (rafId !== null) {
				cancelAnimationFrame(rafId);
			}
		};
	});

	const structuredData = [
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
	{#each structuredData as data}
		{@html `<script type="application/ld+json">${JSON.stringify(data)}</script>`}
	{/each}
</svelte:head>

<svelte:window onscroll={updateSocialsVisibility} onresize={updateSocialsVisibility} />

<Page>
	<main class:collapsed={!showSocials}>
		<div class="landing-wrapper">
			<article class="intro">
				<h1>Continuing the <br />legacy of <span class="accent">Vanced.</span></h1>
				<p class="description">
					Customize your mobile experience through ReVanced <br /> by applying patches to your applications.
				</p>

				<nav class="actions">
					<div class="primary-actions btn-row">
						<Button buttonStyle="filled" icon={Download} href="/download">Download</Button>
						<Button buttonStyle="tonal" icon={Description} href="/patches">View patches</Button>
					</div>

					<div class="external-links btn-row" class:hidden={!showSocials}>
						{#key socialLinks.length}
							{#each socialLinks as link (link.name)}
								<SocialButton social={link} />
							{/each}
						{/key}
					</div>
				</nav>
			</article>

			<aside class="preview">
				<figure class="device-frame">
					<img src={managerImg} alt="Screenshot of ReVanced Manager" />
				</figure>
			</aside>
		</div>
	</main>
	<WaveBackground visibility={showSocials} />
</Page>

<style>
	main {
		display: flex;
		align-items: center;
		flex-direction: column;
		min-height: max(100vh, 600px);
		overflow: hidden;
		padding-block: 5rem;
	}

	main.collapsed {
		min-height: auto;
	}

	.landing-wrapper {
		display: flex;
		gap: 1rem;
		width: min(87%, 80rem);
		align-items: flex-start;
		justify-content: space-evenly;
	}

	.intro {
		display: flex;
		flex-direction: column;
		row-gap: 1rem;
	}

	.intro h1 {
		color: var(--text-one);
	}

	.accent {
		color: var(--primary);
	}

	.actions {
		display: flex;
		flex-direction: column;
		row-gap: 2.5rem;
	}

	.btn-row {
		display: flex;
		flex-wrap: wrap;
		column-gap: 1rem;
		row-gap: 1rem;
		user-select: none;
	}

	.external-links {
		max-width: 30rem;
		position: absolute;
		bottom: 1rem;
		transition: opacity 0.1s var(--bezier-one);
	}

	.external-links.hidden {
		opacity: 0;
		pointer-events: none;
	}

	.preview {
		z-index: 0;
	}

	.device-frame {
		height: max(100vh, 600px);
		margin: 0;
		padding: 0.5rem;
		border-radius: 1.75rem;
		background: var(--surface-seven);
		user-select: none;
	}

	.device-frame img {
		height: 100%;
		border-radius: 1.75rem;
	}

	@media screen and (min-width: 1100px) {
		.intro {
			padding-top: 10vh;
		}
	}

	@media screen and (max-width: 1100px) {
		.preview {
			display: none;
		}
	}

	@media screen and (max-width: 450px) {
		.primary-actions {
			flex-direction: column;
		}

		.external-links {
			left: 0;
			justify-content: center;
		}
	}


	@media screen and (max-width: 335px) {
		main {
			padding-block: 2rem !important;
		}
	}

	@media screen and (max-height: 600px), 
	       screen and (max-width: 450px) and (max-height: 780px) {
		main {
			min-height: auto;
		}

		.external-links {
			position: static;
			opacity: 1 !important;
		}
	}
</style>
