<script lang="ts">
	import { onMount } from 'svelte';

	type Props = {
		value: string;
		size?: number;
	};

	let { value, size = 150 }: Props = $props();

	let canvasElement: HTMLCanvasElement;

	onMount(async () => {
		const QRious = (await import('qrious')).default;

		new QRious({
			element: canvasElement,
			value: value,
			size: size,
			level: 'M'
		});
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
