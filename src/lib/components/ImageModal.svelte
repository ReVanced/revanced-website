<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	export let src: string;
	export let alt: string;

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') closeModal();
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="modal-overlay" on:click={closeModal} transition:fade={{ duration: 175 }}>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="modal-content" on:click|stopPropagation transition:fade={{ duration: 175 }}>
		<button class="close-button" on:click={closeModal}>×</button>
		<img {src} {alt} />
	</div>
</div>

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.85);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		padding: 2rem;
		box-sizing: border-box;
	}

	.modal-content {
		position: relative;
		max-width: 90vw;
		max-height: 90vh;
	}

	img {
		max-width: 100%;
		max-height: 90vh;
		object-fit: contain;
	}

	.close-button {
		position: absolute;
		top: -1rem;
		right: -2rem;
		background: none;
		border: none;
		color: white;
		font-size: 2rem;
		cursor: pointer;
		padding: 0.5rem;
		line-height: 1;
		z-index: 1001;
	}

	.close-button:hover {
		color: #ddd;
	}
</style>
