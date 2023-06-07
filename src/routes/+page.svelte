<script>
	import HeroImage from '$layout/Hero/HeroImage.svelte';
	import SocialButton from '$layout/Navbar/SocialButton.svelte';
	import Home from '$layout/Hero/HeroSection.svelte';
	import Wave from '$lib/components/Wave.svelte';
	import Meta from '$lib/components/Meta.svelte';
</script>

<Meta />

<main>
	<div class="wrap">
		<div class="wrappezoid">
			<Home />
			<div id="heroimg"><HeroImage /></div>
			<div class="social-host">
				<SocialButton size={32} src="github" href="https://github.com/revanced" />
				<SocialButton size={32} src="discord" href="https://revanced.app/discord" />
				<SocialButton size={32} src="reddit" href="https://reddit.com/r/revancedapp" />
				<SocialButton size={32} src="telegram" href="https://t.me/app_revanced" />
			</div>
		</div>
	</div>
</main>
<Wave />

<style>
	.social-host {
		background-color: var(--bg-color);
		max-width: min-content;
		padding: 1rem;
		align-items: center;
		user-select: none;
		position: absolute;
		border-radius: 2rem;
		display: flex;
		bottom: 1rem;
		gap: 1.5rem;
		left: 50%;
		translate: -50% 0;
	}
	@media (min-width: 768px) {
		.social-host {
			display: none;
		}
	}
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
	@media (max-width: 768px) {
		.wrappezoid {
			display: flex;
			justify-content: center;
			align-items: center;
			height: calc(65vh);
		}
	}
</style>
