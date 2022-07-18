<script>
	import Button from '$lib/components/atoms/Button.svelte';
    import IndexHeroTitle from '../atoms/IndexHeroTitle.svelte';
</script>

<section class="hero">
    <div class="hero-text">
        <!-- <img class="hero-img" src="/manager.png" alt="Screenshot of ReVanced Manager" /> -->
        <IndexHeroTitle></IndexHeroTitle>
        <h3>An extensible framework for<br />building application mods.</h3>
        <Button kind="primary" href="/download">Download</Button>
        <Button href="/docs">Read The Docs</Button>
    </div>
</section>

<style>
	.hero-text {
		margin-top: 3%;
		align-items: center;
	}

	.hero-text h1 {
		font-size: 6.5rem;
		letter-spacing: -0.04em;
	}
</style>
