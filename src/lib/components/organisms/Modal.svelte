<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { WithChildren } from '$types';
	import { modalStack } from '$stores/modalStack';
	import { fade } from 'svelte/transition';

	type Props = {
		id: string; // unique id for stacking
		open?: boolean; // controlled state
		label?: string; // accessible label (if no heading provided)
		buttons?: Snippet; // actions snippet
		initialFocusSelector?: string; // optional query selector inside modal
	} & WithChildren;

	let {
		id,
		open = $bindable(false),
		label,
		buttons,
		children,
		initialFocusSelector
	}: Props = $props();

	let stack = $state<string[]>([]);
	$effect(() => {
		const unsub = modalStack.subscribe((s) => (stack = s));
		return unsub;
	});

	let isTop = $derived(stack.length > 0 && stack[stack.length - 1] === id);
	let dialogEl = $state<HTMLDivElement | undefined>(undefined);
	let lastFocused: Element | null = null;

	function ensureFocus() {
		if (!dialogEl) return;
		// Try initial selector, else first focusable, else container
		const target = initialFocusSelector
			? (dialogEl.querySelector(initialFocusSelector) as HTMLElement | null)
			: findFirstFocusable(dialogEl);
		(target || dialogEl).focus({ preventScroll: true });
	}

	function findFirstFocusable(root: HTMLElement): HTMLElement | null {
		const selectors = [
			'a[href]',
			'button:not([disabled])',
			'input:not([disabled])',
			'select:not([disabled])',
			'textarea:not([disabled])',
			'[tabindex]:not([tabindex="-1"])'
		];
		return (root.querySelector(selectors.join(',')) as HTMLElement | null) || null;
	}

	function close() {
		open = false;
		modalStack.close(id);
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			close();
			return;
		}
		if (e.key === 'Tab') {
			// Focus trap
			trapTab(e);
		}
	}

	function trapTab(e: KeyboardEvent) {
		if (!dialogEl) return;
		const focusables = Array.from(
			dialogEl.querySelectorAll<HTMLElement>(
				'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
			)
		).filter((el) => el.offsetParent !== null);
		if (focusables.length === 0) {
			e.preventDefault();
			return;
		}
		const first = focusables[0];
		const last = focusables[focusables.length - 1];
		const active = document.activeElement as HTMLElement | null;
		if (e.shiftKey) {
			if (active === first || !focusables.includes(active!)) {
				e.preventDefault();
				last.focus();
			}
		} else {
			if (active === last) {
				e.preventDefault();
				first.focus();
			}
		}
	}

	$effect(() => {
		if (open) {
			if (!modalStack.isOpen(id)) modalStack.open(id, () => (open = false));
			lastFocused = document.activeElement;
			queueMicrotask(ensureFocus);
		} else if (modalStack.isOpen(id)) {
			modalStack.close(id);
			if (lastFocused instanceof HTMLElement) {
				lastFocused.focus();
			}
		}
	});

	$effect(() => {
		// If stack changed and this modal is no longer top, do nothing special; focus remains within top.
	});
</script>

{#if open && isTop}
	<div
		bind:this={dialogEl}
		class="modal"
		role="dialog"
		aria-modal="true"
		aria-label={label}
		id={`${id}-modal`}
		tabindex="-1"
		onkeydown={onKey}
		transition:fade={{ duration: 180 }}
	>
		<div class="content">{@render children()}</div>
		{#if buttons}
			<div class="buttons">{@render buttons()}</div>
		{/if}
	</div>
{/if}

<style>
	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: var(--space-6) var(--space-6) var(--space-5);
		max-width: min(640px, 90vw);
		max-height: 90vh;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
		z-index: var(--z-modal);
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-2);
		box-shadow: var(--shadow-3);
	}

	.content { flex: 1; }

	.buttons {
		display: flex;
		gap: var(--space-3);
		justify-content: flex-end;
		margin-top: var(--space-2);
	}

	@media (prefers-color-scheme: dark) {
		.modal { background: var(--color-bg-alt); }
	}
</style>