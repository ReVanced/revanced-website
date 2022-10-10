<script>
	import HeroImage from '$lib/components/atoms/HeroImage.svelte';
	import Home from '$lib/components/organisms/Home.svelte';
	import SocialHost from '$lib/components/molecules/SocialHost.svelte';
</script>

<div class="wrapper">
	<div class="wrappezoid">
		<Home />
		<div id="heroimg"><HeroImage /></div>
	</div>
</div>
<SocialHost />

<style>
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
			justify-content: space-between;;
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