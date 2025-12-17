<script lang="ts">
	import ImageDialog from '$components/molecules/ImageDialog.svelte';

	type Props = {
		images: string[];
		columns?: number;
		gap?: string;
	};

	let { images, columns = 3, gap = '1rem' }: Props = $props();

	let lightboxOpen = $state(false);
	let selectedIndex = $state(0);

	function openLightbox(index: number) {
		selectedIndex = index;
		lightboxOpen = true;
	}

	function closeLightbox() {
		lightboxOpen = false;
	}

	function handleKeydown(event: KeyboardEvent, index: number) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			openLightbox(index);
		}
	}
</script>

<div class="gallery" style:--columns={columns} style:--gap={gap}>
	{#each images as image, i}
		<button
			type="button"
			class="image-container"
			onclick={() => openLightbox(i)}
			onkeydown={(e) => handleKeydown(e, i)}
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

{#if lightboxOpen}
	<ImageDialog
		{images}
		currentIndex={selectedIndex}
		onclose={closeLightbox}
	/>
{/if}

<style>
	.gallery {
		display: grid;
		grid-template-columns: repeat(var(--columns), 1fr);
		gap: var(--gap);
		width: 100%;
	}

	.image-container {
		aspect-ratio: 4 / 3;
		overflow: hidden;
		border-radius: 12px;
		border: 1px solid var(--border);
		background: var(--surface-three);
		cursor: pointer;
		padding: 0;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.image-container:hover {
		transform: scale(1.02);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
