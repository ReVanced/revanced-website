<script>
	import HeroImage from '$lib/components/atoms/HeroImage.svelte';
	import Home from '$lib/components/organisms/Home.svelte';
	import SocialHost from '$lib/components/molecules/SocialHost.svelte';
	import Wave from '$lib/components/atoms/Wave.svelte';
</script>

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
	@media (max-width: 768px) {
		.wrappezoid {
			display: flex;
			justify-content: center;
			align-items: center;
			height: calc(65vh);
		}
	}
</style>
