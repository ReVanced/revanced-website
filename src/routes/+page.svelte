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
			},
			sameAs: [
				'https://github.com/revanced',
				'https://twitter.com/revancedapp',
				'https://revanced.app/discord',
				'https://www.reddit.com/r/revancedapp',
				'https://t.me/app_revanced',
				'https://www.youtube.com/@ReVanced'
			]
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
		margin-top: 7rem;
	}
	.wrappezoid {
		height: calc(100vh - 120px);
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
			height: calc(65vh);
		}
	}
</style>
