<script lang="ts">
	import { modalStack } from '$stores/modalStack';
	import { fade } from 'svelte/transition';

	let stack = $state<string[]>([]);
	$effect(() => {
		const unsub = modalStack.subscribe((s) => (stack = s));
		return unsub;
	});
	let hasModals = $derived(stack.length > 0);

	function closeTop() {
		modalStack.closeTop();
	}

	function handleKey(e: KeyboardEvent) {
		if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
			// Space key triggers on keyup typically; prevent scroll
			if (e.key === ' ') e.preventDefault();
			closeTop();
		}
	}
</script>

{#if hasModals}
	<button
		class="modal-backdrop"
		transition:fade={{ duration: 250 }}
		aria-label="Close modal"
		onclick={closeTop}
		onkeydown={handleKey}
		type="button"
	></button>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.3);
		z-index: var(--z-modal-backdrop);
		cursor: pointer;
		border: 0;
	}
</style>
