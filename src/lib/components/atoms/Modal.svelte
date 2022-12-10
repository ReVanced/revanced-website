<script lang="ts">
	import { click_outside } from '$lib/utils';
	import { fade } from 'svelte/transition';

	let modalOpen = false;
	export let icon: string;
	export let alt: string;
</script>

<div>
	<button class="modal-btn" on:click={() => (modalOpen = !modalOpen)}>
		<img src={icon} {alt} />
	</button>
	{#if modalOpen}
		<div class="overlay" />
		<div
			class="modal-container"
			role="dialog"
			aria-modal="true"
			use:click_outside
			on:click_outside={() => (modalOpen = false)}
			transition:fade={{ duration: 125 }}
		>
			<slot />
		</div>
	{/if}
</div>

<style>
	button.modal-btn {
		border: 0;
		background-color: transparent;
		transition-timing-function: var(--bezier-one);
		transition-duration: 0.25s;
		padding: 10px 25px;
		border-radius: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	button.modal-btn:hover {
		color: var(--white);
		background-color: var(--grey-one);
	}

	img {
		height: 1.75rem;
		width: auto;
		cursor: pointer;
		display: flex;
		align-items: center;
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1;
	}

	@media (max-width: 768px) {
		button.modal-btn {
			padding: 1rem 1.5rem;
			border-radius: 16px;
		}
	}
</style>
