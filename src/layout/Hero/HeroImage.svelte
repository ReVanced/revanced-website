<script>
	import Picture from '$lib/components/Picture.svelte';
	import manager_screenshot from '$images/manager.png?w=1233;822;411&format=avif;webp;png&as=picture';
</script>

<div class="hero-img">
	<Picture data={manager_screenshot} alt="Screenshot of ReVanced Manager" />
</div>

<style>
	.hero-img :global(img) {
		height: 100%;
		border-radius: 1.75rem;
	}

	.hero-img {
		height: 70vh;
		padding: 0.5rem 0.5rem;
		border-radius: 1.75rem;
		background-color: var(--surface-seven);
		user-select: none;
	}
	@media screen and (max-width: 1700px) {
		.hero-img {
			height: 100vh;
			right: 6rem;
		}
	}
</style>
