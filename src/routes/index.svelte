<script>
	import HeroImage from '$lib/components/atoms/HeroImage.svelte';
	import IndexDescription from '$lib/components/organisms/IndexDescription.svelte';
	import SocialHost from '$lib/components/molecules/SocialHost.svelte';
</script>

<div class="wrapper">
	<div class="wrappezoid">
		<IndexDescription />
		<HeroImage />
	</div>
	<SocialHost />
</div>

<style>
	.wrappezoid {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
	}
	@media (max-width: 768px) {
		.wrappezoid {
			flex-direction: column;
		}
	}
</style>