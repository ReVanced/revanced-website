<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { WithChildren } from '$types';
	import { modalsStack } from '$stores/modals.svelte';
	import { fade, fly } from 'svelte/transition';
	import IconClose from 'virtual:icons/material-symbols/close';

	type Props = {
		id?: string;
		modalId?: string;
		open?: boolean;
		title?: string;
		fullscreen?: boolean;
		buttons?: Snippet;
	} & WithChildren;

	let {
		id,
		modalId,
		buttons,
		children,
		title,
		fullscreen = false,
		open = $bindable(false)
	}: Props = $props();

	let effectiveId = $derived(modalId ?? id ?? 'modal');

	let isVisible = $derived(modalsStack.isOpen(effectiveId) || open);
	let isTopModal = $derived(modalsStack.isTopModal(effectiveId));

	let dialogElement: HTMLDialogElement | null = $state(null);
	let previousActiveElement: Element | null = null;

	$effect(() => {
		if (open && !modalsStack.isOpen(effectiveId)) {
			modalsStack.push(effectiveId, () => (open = false));
		} else if (!open && modalsStack.isOpen(effectiveId)) {
			modalsStack.pop(effectiveId);
		}
	});

	// Focus management: save focus, restore on close
	$effect(() => {
		if (isVisible && isTopModal) {
			previousActiveElement = document.activeElement;
			// Focus the dialog or first focusable element
			queueMicrotask(() => {
				const focusable = dialogElement?.querySelector<HTMLElement>(
					'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
				);
				focusable?.focus();
			});
		} else if (previousActiveElement && previousActiveElement instanceof HTMLElement) {
			previousActiveElement.focus();
			previousActiveElement = null;
		}
	});

	function closeModal() {
		open = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isTopModal) {
			event.preventDefault();
			closeModal();
			return;
		}

		// Focus trap: Tab key cycles within modal
		if (event.key === 'Tab' && dialogElement) {
			const focusableElements = dialogElement.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);
			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			if (event.shiftKey) {
				// Shift+Tab: if on first element, go to last
				if (document.activeElement === firstElement) {
					event.preventDefault();
					lastElement?.focus();
				}
			} else {
				// Tab: if on last element, go to first
				if (document.activeElement === lastElement) {
					event.preventDefault();
					firstElement?.focus();
				}
			}
		}
	}
</script>

{#if isVisible && isTopModal}
	<dialog
		bind:this={dialogElement}
		class="modal"
		class:fullscreen
		aria-modal="true"
		aria-labelledby={title ? 'modal-title' : undefined}
		transition:fade={{ duration: 200 }}
		onclick={(e) => e.stopPropagation()}
		onkeydown={handleKeydown}
	>
		{#if title || fullscreen}
			<header class="header">
				{#if title}
					<h2 id="modal-title" class="title">{title}</h2>
				{/if}
				<button type="button" class="close-button" onclick={closeModal} aria-label="Close">
					<IconClose />
				</button>
			</header>
		{/if}
		<div class="content" in:fly={{ y: 10, duration: 300 }}>
			{@render children()}
		</div>
		{#if buttons}
			<div class="buttons">
				{@render buttons()}
			</div>
		{/if}
	</dialog>
{/if}

<style>
	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 1.5rem;
		min-width: 400px;
		max-width: 90vw;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		z-index: 9999;
		background-color: var(--surface-eight, #1e1f24);
		border: 1px solid var(--border);
		border-radius: 24px;
		transition: height 0.3s ease;
	}

	.modal.fullscreen {
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		transform: none;
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
		min-width: auto;
		border-radius: 0;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--border);
	}

	.title {
		margin: 0;
		font-size: 1.25rem;
		color: var(--text-one);
	}

	.close-button {
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		color: var(--text-four);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s var(--bezier-one);
	}

	.close-button:hover {
		background-color: var(--surface-four);
		color: var(--text-one);
	}

	.close-button :global(svg) {
		width: 24px;
		height: 24px;
	}

	.content {
		flex: 1;
		overflow-y: auto;
	}

	.buttons {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
	}

	@media (max-width: 768px) {
		.modal:not(.fullscreen) {
			min-width: auto;
			width: 90vw;
		}
	}
</style>
