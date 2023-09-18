<script>
	import HeroImage from '$layout/Hero/HeroImage.svelte';
	import Home from '$layout/Hero/HeroSection.svelte';
	import SocialHost from '$layout/Hero/SocialHost.svelte';
	import Wave from '$lib/components/Wave.svelte';
	import Meta from '$lib/components/Meta.svelte';
</script>

<Meta
	schema={{
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'ReVanced',
		abstract: 'Continuing the legacy of Vanced',
		breadcrumb: 'Home',
		publisher: {
			'@type': 'Organization',
			name: 'ReVanced',
			url: 'https://revanced.app/',
			logo: {
				'@type': 'ImageObject',
				url: 'https://revanced.app/embed.png'
			}
		}
	}}
/>

<main>
	<div class="wrap">
		<div class="wrappezoid">
			<Home />
			<div id="heroimg"><HeroImage /></div>
		</div>
	</div>
	<SocialHost />
</main>
<Wave />

<style>
	.wrap {
		margin-inline: auto;
		width: min(87%, 100rem);
	}
	.wrappezoid {
		height: 100%;
		padding-top: 2.5rem;
		min-height: calc(100vh/10*7);
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 22rem;
		align-items: center;
	}
	@media (max-width: 1700px) {
		.wrappezoid {
			justify-content: space-between;
		}
	}
	@media (max-width: 1052px) {
		#heroimg {
			display: none;
		}
	}
	@media (max-width: 767px) {
		.wrappezoid {
			display: flex;
			justify-content: center;
			align-items: center;
			min-height: calc(65vh);
		}
	}

	@media (max-height: 768px) {
		.wrappezoid {
			padding-top: 2rem;
			padding-bottom: 8rem;
		}
	}
</style>
