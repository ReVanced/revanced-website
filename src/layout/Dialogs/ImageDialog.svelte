<script lang="ts">
	import { fade } from 'svelte/transition';

	let {
		src,
		alt,
		onclose = () => {}
	}: {
		src: string;
		alt: string;
		onclose?: () => void;
	} = $props();

	function closeDialog() {
		onclose();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') closeDialog();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="dialog-overlay" onclick={closeDialog} transition:fade={{ duration: 175 }}>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="dialog-content" onclick={(e) => e.stopPropagation()} transition:fade={{ duration: 175 }}>
		<button class="close-button" onclick={closeDialog}>×</button>
		<img {src} {alt} />
	</div>
</div>

<style>
	.dialog-overlay {
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

	.dialog-content {
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
