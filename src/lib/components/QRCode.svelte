<script lang="ts">
	import { onMount } from 'svelte';
	import QRious from 'qrious/dist/qrious';

	export let codeValue: string;
	export let squareSize: number = 150;

	onMount(() => {
		new QRious({
			element: document.getElementById('qrcode'),
			value: codeValue,
			size: squareSize
		});
	});
</script>

<canvas id="qrcode" />

<style>
	canvas {
		border-radius: 0.5rem;
		background-color: white;
		padding: 0.25rem;
	}
</style>
