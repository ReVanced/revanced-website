<script lang="ts">
	import ImageDialog from '$components/molecules/ImageDialog.svelte';

	type Props = {
		images: string[];
		columns?: number;
		gap?: string;
	};

	let { images, columns = 3, gap = '1rem' }: Props = $props();

	let selectedImage: { src: string; alt: string } | null = $state(null);

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

<div class="gallery" style:--columns={columns} style:--gap={gap}>
	{#each images as image, i}
		<button
			type="button"
			class="image-container"
			onclick={() => openDialog(image, i)}
			onkeydown={(e) => e.key === 'Enter' && openDialog(image, i)}
			aria-label={`View image ${i + 1} of ${images.length}`}
		>
			<img
				src={image}
				alt={`Gallery image ${i + 1}`}
				loading="lazy"
			/>
		</button>
	{/each}
</div>

{#if selectedImage}
	<ImageDialog src={selectedImage.src} alt={selectedImage.alt} onclose={closeDialog} />
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
		cursor: pointer;
		padding: 0;
		background: transparent;
		border: none;
	}

	.image-container:focus-visible {
		outline: 2px solid var(--primary);
		outline-offset: 2px;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.3s ease;
	}

	img:hover {
		transform: scale(1.05);
	}

	@media (max-width: 768px) {
		.gallery {
			--columns: 2 !important;
		}
	}

	@media (max-width: 480px) {
		.gallery {
			--columns: 1 !important;
		}
	}
</style>
