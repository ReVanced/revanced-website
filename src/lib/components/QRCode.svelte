<script lang="ts">
	let { codeValue, squareSize = 150 }: { codeValue: string; squareSize?: number } = $props();

	let canvas = $state() as HTMLCanvasElement;

	$effect(() => {
		// @ts-ignore
		import('qrious/dist/qrious').then((module) => { // when i remove the comment ts-ignore it breaks???
			const QRious = module.default || module;
			new QRious({
				element: canvas,
				value: codeValue,
				size: squareSize
			});
		});
	});
</script>

<canvas bind:this={canvas}></canvas>

<style>
	canvas {
		border-radius: 0.5rem;
		background-color: white;
		padding: 0.25rem;
	}
</style>
