<div class="spinner" />

<style>
	@keyframes spinner {
		to {
			transform: rotate(360deg);
		}
	}

	.spinner {
		position: fixed;
		top: 50%;
		left: 50%;
		width: 50px;
		height: 50px;
		transform: translate(-50%, -50%);
	}

	.spinner:before {
		content: '';
		box-sizing: border-box;
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		border: 4.5px solid transparent;
		border-top-color: var(--primary);
		animation: spinner 0.6s linear infinite;
	}
</style>
