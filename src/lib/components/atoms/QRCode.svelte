<script lang="ts">
	import { browser } from '$app/environment';

	type Props = {
		value: string;
		size?: number;
	};

	let { value, size = 150 }: Props = $props();

	let canvasElement: HTMLCanvasElement;
	let QRiousClass: typeof import('qrious').default | null = null;

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
		})();
	});
</script>

<canvas bind:this={canvasElement}></canvas>

<style>
	canvas {
		border-radius: 8px;
		background-color: white;
		padding: 0.5rem;
	}
</style>
