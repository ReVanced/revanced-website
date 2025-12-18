<script lang="ts">
	import { fade } from 'svelte/transition';
</script>

<div class="spinner-overlay" transition:fade={{ duration: 200 }}>
	<div class="spinner"></div>
</div>

<style>
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.spinner-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(var(--surface-one-rgb), 0.7);
		backdrop-filter: blur(2px);
		z-index: var(--z-top);
	}

	.spinner {
		width: 50px;
		height: 50px;
		position: relative;
	}

	.spinner::before {
		content: '';
		box-sizing: border-box;
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		border: 4.5px solid transparent;
		border-top-color: var(--primary);
		animation: spin 0.6s linear infinite;
	}
</style>
