<script>
	import Footer from '$layout/Footer.svelte';

	import Home from '$layout/Hero/HeroSection.svelte';
	import Meta from '$lib/components/Meta.svelte';
</script>

<Meta />

<main>
	<div class="wrap">
		<Home />

	</div>
</main>
<Footer />

<style>
	.wrap {
		margin-inline: auto;
		width: min(87%, 100rem);
		margin-top: 9rem;
	}

</style>
