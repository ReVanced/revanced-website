<script>
	import IndexDescription from '$lib/components/organisms/IndexDescription.svelte';
	import Wave from '$lib/components/atoms/Wave.svelte';
	import HeroImage from '$lib/components/atoms/HeroImage.svelte';
	import SocialHost from '$lib/components/molecules/SocialHost.svelte';
</script>

<div class="wrapper">
	<IndexDescription />
	<HeroImage />
	<SocialHost />
</div>

<Wave />


<style>
	.wrapper {
		padding-left: 6rem;
		padding-right: 6rem;
	}
</style>
