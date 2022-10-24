<script>
  import { fade } from "svelte/transition";
</script>
<div class="spinner" transition:fade={{duration: 250}}/>

<style>
	@keyframes spinner {
		to {
			transform: rotate(360deg);
		}
	}

	.spinner:before {
		content: '';
		box-sizing: border-box;
		position: fixed;
		top: 48.25%;
		left: 48.25%;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		border: 4.5px solid transparent;
		border-top-color: var(--accent-color);
		animation: spinner 0.6s linear infinite;
	}
</style>
