<script lang="ts">
	import { fade } from 'svelte/transition';
	import { quadInOut } from 'svelte/easing';
	export let modalOpen = false;
</script>

{#if modalOpen}
	<div class="modal-container" transition:fade={{ easing: quadInOut, duration: 150 }}>
		<div class="modal">
			<slot />
		</div>
		<div class="overlay" on:click={() => (modalOpen = !modalOpen)} />
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1000;
	}

	.modal {
		position: fixed;
		width: min(95%, 500px);
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 42px;
		border-radius: 16px;
		background-color: var(--grey-six);
		display: flex;
		user-select: none;
		gap: 5%;
		white-space: normal;
		display: flex;
		flex-direction: column;
		gap: 2px;
		z-index: 1001;
		box-shadow: 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12),
			0px 2px 4px -1px rgba(0, 0, 0, 0.2);
	}
</style>
