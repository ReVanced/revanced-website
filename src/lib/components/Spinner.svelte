<script>
	import { fade } from 'svelte/transition';
</script>

<div class="spinner-container">
	<div class="spinner" transition:fade={{ duration: 250 }} />
</div>

<style>
	@keyframes spinner {
		to {
			transform: rotate(360deg);
		}
	}

	.spinner-container {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.spinner:before {
		content: '';
		box-sizing: border-box;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		border: 4.5px solid transparent;
		border-top-color: var(--accent-color);
		animation: spinner 0.6s linear infinite;
	}
</style>
