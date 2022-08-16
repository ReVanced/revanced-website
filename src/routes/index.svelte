<script>
	import HeroImage from '$lib/components/atoms/HeroImage.svelte';
	import IndexDescription from '$lib/components/organisms/IndexDescription.svelte';
	import SocialHost from '$lib/components/molecules/SocialHost.svelte';
</script>

<div class="wrapper">
	<div class="wrappezoid">
		<IndexDescription />
		<div id="heroimg"><HeroImage /></div>
	</div>
	<SocialHost />
</div>

<style>
	.wrappezoid {
		height: calc(100vh - 90px);
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
	}
	@media (max-width: 1919px) {
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
			flex-direction: column;
		}
	}
</style>