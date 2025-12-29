<script lang="ts">
	import { modalsStack } from '$stores/modals.svelte';
	import { fade } from 'svelte/transition';
	import { quadInOut } from 'svelte/easing';

	let hasModals = $derived(modalsStack.getStack().length > 0);
</script>

{#if hasModals}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="modal-background"
		transition:fade={{ easing: quadInOut, duration: 150 }}
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
		background: rgba(0, 0, 0, 0.5);
		z-index: var(--z-modal-backdrop);
	}
</style>
