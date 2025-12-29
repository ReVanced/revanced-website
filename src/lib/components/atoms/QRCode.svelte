<script lang="ts">
	import { browser } from '$app/environment';

	type Props = {
		value: string;
		size?: number;
	};

	let { value, size = 150 }: Props = $props();

	let canvasElement: HTMLCanvasElement;
	let QRiousClass: typeof import('qrious').default | null = null;
	let isReady = $state(false);

	$effect(() => {
		if (!browser || !canvasElement) return;
		(async () => {
			if (!QRiousClass) {
				QRiousClass = (await import('qrious')).default;
			}

			new QRiousClass({
				element: canvasElement,
				value: value,
				size: size,
				level: 'M'
			});
			isReady = true;
		})();
	});
</script>

<canvas bind:this={canvasElement} class:ready={isReady}></canvas>

<style>
	canvas {
		border-radius: 0.5rem;
		background-color: transparent;
		padding: 0.25rem;
		opacity: 0;
		transition: opacity 0.15s ease-in-out;
	}

	canvas.ready {
		background-color: white;
		opacity: 1;
	}
</style>
