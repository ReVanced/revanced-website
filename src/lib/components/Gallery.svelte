<script lang="ts">
	import ImageDialog from '$layout/Dialogs/ImageDialog.svelte';

	export let images: string[];
	export let columns: number = 3;
	export let gap: string = '1rem';

	let selectedImage: { src: string; alt: string } | null = null;

	function openDialog(image: string, index: number) {
		selectedImage = {
			src: image,
			alt: `Gallery image ${index + 1}`
		};
	}

	function closeDialog() {
		selectedImage = null;
	}
</script>

<div class="gallery" style="--columns: {columns}; --gap: {gap}">
	{#each images as image, i}
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<div class="image-container">
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<img
				src={image}
				alt={`Gallery image ${i + 1}`}
				loading="lazy"
				on:click={() => openDialog(image, i)}
				on:keydown={(e) => e.key === 'Enter' && openDialog(image, i)}
				tabindex="0"
			/>
		</div>
	{/each}
</div>

{#if selectedImage}
	<ImageDialog src={selectedImage.src} alt={selectedImage.alt} on:close={closeDialog} />
{/if}

<style>
	.gallery {
		display: grid;
		grid-template-columns: repeat(var(--columns), 1fr);
		gap: var(--gap);
		width: 100%;
		padding: 1rem;
	}

	.image-container {
		aspect-ratio: 4 / 3;
		overflow: hidden;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
		cursor: pointer;
	}

	img:hover {
		transform: scale(1.05);
	}

	@media (max-width: 768px) {
		.gallery {
			--columns: 2;
		}
	}

	@media (max-width: 480px) {
		.gallery {
			--columns: 1;
		}
	}
</style>
