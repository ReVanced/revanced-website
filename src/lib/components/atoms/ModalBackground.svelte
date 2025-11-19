<script lang="ts">
	import { modalsStack } from '$stores/modals.svelte';
	import { fade } from 'svelte/transition';

	let hasModals = $derived(modalsStack.getStack().length > 0);
</script>

{#if hasModals}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="modal-background"
		transition:fade={{ duration: 300 }}
		onclick={() => modalsStack.closeTop()}
	></div>
{/if}

<style>
	.modal-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.3);
		z-index: 9998;
	}
</style>
