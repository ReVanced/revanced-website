<script>
	import Picture from '$lib/components/Picture.svelte';
	import manager_screenshot from '$images/manager_two.png?w=1233;822;411&format=avif;webp;png&picture';
</script>

<div class="hero-img">
	<img src="src/lib/manager_two.png" alt="manager" />
</div>

<style>
	.hero-img :global(img) {
		height: 100%;
		border-radius: 1.75rem;
	}

	.hero-img {
		height: clamp(30rem, 80vw, 40rem);
		width: auto;
		z-index: -1;
		padding: 0.5rem 0.5rem;
		border-radius: 1.75rem;
		user-select: none;
		--webkit-user-select: none;
	}
</style>
