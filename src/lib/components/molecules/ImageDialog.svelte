<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import IconClose from 'virtual:icons/material-symbols/close';
	import IconChevronLeft from 'virtual:icons/material-symbols/chevron-left';
	import IconChevronRight from 'virtual:icons/material-symbols/chevron-right';

	type Props = {
		images: string[];
		currentIndex?: number;
		onclose: () => void;
	};

	let { images, currentIndex = 0, onclose }: Props = $props();

	let activeIndex = $state(0);
	$effect(() => {
		activeIndex = currentIndex;
	});

	let currentImage = $derived(images[activeIndex]);
	let hasMultiple = $derived(images.length > 1);
	let canGoPrev = $derived(activeIndex > 0);
	let canGoNext = $derived(activeIndex < images.length - 1);

	function goToPrev() {
		if (canGoPrev) {
			activeIndex--;
		}
	}

	function goToNext() {
		if (canGoNext) {
			activeIndex++;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'Escape':
				onclose();
				break;
			case 'ArrowLeft':
				goToPrev();
				break;
			case 'ArrowRight':
				goToNext();
				break;
		}
	}

	function handleOverlayClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onclose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="overlay"
	onclick={handleOverlayClick}
	transition:fade={{ duration: 200, easing: quintOut }}
>
	<div class="dialog-container" transition:scale={{ duration: 200, start: 0.95, easing: quintOut }}>
		<button class="close-btn" onclick={onclose} aria-label="Close">
			<IconClose />
		</button>

		{#if hasMultiple}
			<button
				class="nav-btn prev"
				onclick={goToPrev}
				disabled={!canGoPrev}
				aria-label="Previous image"
			>
				<IconChevronLeft />
			</button>
		{/if}

		<div class="image-wrapper">
			{#key activeIndex}
				<img
					src={currentImage}
					alt={`Image ${activeIndex + 1} of ${images.length}`}
					in:fade={{ duration: 150 }}
				/>
			{/key}
		</div>

		{#if hasMultiple}
			<button
				class="nav-btn next"
				onclick={goToNext}
				disabled={!canGoNext}
				aria-label="Next image"
			>
				<IconChevronRight />
			</button>
		{/if}

		{#if hasMultiple}
			<div class="indicator">
				{activeIndex + 1} / {images.length}
			</div>
		{/if}
	</div>
</div>

<style>
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 10000;
		background-color: rgba(0, 0, 0, 0.9);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	.dialog-container {
		position: relative;
		max-width: 95vw;
		max-height: 95vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-btn {
		position: absolute;
		top: -3rem;
		right: 0;
		background: transparent;
		border: none;
		color: white;
		font-size: 1.75rem;
		cursor: pointer;
		padding: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.8;
		transition: opacity 0.2s ease;
		z-index: 10;
	}

	.close-btn:hover {
		opacity: 1;
	}

	.image-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		max-width: 90vw;
		max-height: 85vh;
	}

	img {
		max-width: 100%;
		max-height: 85vh;
		object-fit: contain;
		border-radius: 8px;
	}

	.nav-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background: rgba(255, 255, 255, 0.1);
		border: none;
		color: white;
		font-size: 2rem;
		cursor: pointer;
		padding: 1rem 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		opacity: 0.7;
		transition: opacity 0.2s ease, background-color 0.2s ease;
	}

	.nav-btn:hover:not(:disabled) {
		opacity: 1;
		background: rgba(255, 255, 255, 0.2);
	}

	.nav-btn:disabled {
		opacity: 0.2;
		cursor: not-allowed;
	}

	.nav-btn.prev {
		left: -4rem;
	}

	.nav-btn.next {
		right: -4rem;
	}

	.indicator {
		position: absolute;
		bottom: -2.5rem;
		left: 50%;
		transform: translateX(-50%);
		color: white;
		font-size: 0.9rem;
		opacity: 0.8;
	}

	@media (max-width: 768px) {
		.nav-btn.prev {
			left: 0.5rem;
		}

		.nav-btn.next {
			right: 0.5rem;
		}

		.nav-btn {
			padding: 0.75rem 0.25rem;
			font-size: 1.5rem;
			background: rgba(0, 0, 0, 0.5);
		}

		.close-btn {
			top: 0.5rem;
			right: 0.5rem;
			position: fixed;
		}
	}
</style>
