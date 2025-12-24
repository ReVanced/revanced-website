<script lang="ts">
	import Button from '$components/atoms/Button.svelte';
	import { fade } from 'svelte/transition';
	import { quadInOut } from 'svelte/easing';

	type Props = {
		open: boolean;
		onConfirm: () => void;
		onCancel: () => void;
	};

	let {
		open = $bindable(),
		onConfirm,
		onCancel
	}: Props = $props();

	function handleConfirm() {
		open = false;
		onConfirm();
	}

	function handleCancel() {
		open = false;
		onCancel();
	}

	function handleOverlayClick() {
		handleCancel();
	}

	function handleDialogClick(e: MouseEvent) {
		e.stopPropagation();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			handleCancel();
		}
	}
</script>

<svelte:window onkeydown={open ? handleKeydown : undefined} />

{#if open}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="overlay"
		onclick={handleOverlayClick}
		transition:fade={{ easing: quadInOut, duration: 150 }}
	></div>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="modal"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onclick={handleDialogClick}
		transition:fade={{ easing: quadInOut, duration: 150 }}
	>
		<div class="title">
			<h3>Confirm?</h3>
		</div>

		<p class="description">Do you want to delete this announcement?</p>

		<div class="buttons">
			<Button buttonStyle="text" onclick={handleCancel}>No</Button>
			<Button buttonStyle="filled" onclick={handleConfirm}>Yes</Button>
		</div>
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
		z-index: var(--z-modal-backdrop);
	}

	.modal {
		position: fixed;
		width: min(85%, 425px);
		max-height: 75%;
		overflow-y: auto;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border: none;
		border-radius: 26px;
		background-color: var(--surface-seven);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		z-index: var(--z-modal);
		padding: 32px;
		white-space: normal;
		box-shadow:
			0px 4px 5px 0px rgba(0, 0, 0, 0.14),
			0px 1px 10px 0px rgba(0, 0, 0, 0.12),
			0px 2px 4px -1px rgba(0, 0, 0, 0.2);
	}

	.title {
		display: flex;
		align-items: center;
		width: 100%;
	}

	.title h3 {
		margin: 0;
		font-size: 1.5rem;
		color: var(--secondary);
	}

	.description {
		color: var(--text-four);
		text-align: center;
		margin: 0;
	}

	.buttons {
		display: flex;
		gap: 2rem;
		justify-content: flex-end;
		width: 100%;
	}
</style>
