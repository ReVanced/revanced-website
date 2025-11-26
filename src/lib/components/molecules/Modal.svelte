<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { WithChildren } from '$types';
	import { modalsStack } from '$stores/modals.svelte';
	import { fade } from 'svelte/transition';

	type Props = {
		id: string;
		open?: boolean;
		buttons?: Snippet;
	} & WithChildren;
	let { id, buttons, children, open = $bindable(true) }: Props = $props();

	let isTopModal = $derived(modalsStack.isTopModal(id));

	$effect(() => {
		if (open) modalsStack.push(id, () => (open = false));
		else modalsStack.pop(id);
	});
</script>

{#if isTopModal}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<dialog
		class="modal rounded"
		transition:fade={{ duration: 300 }}
		onclick={(e) => e.stopPropagation()}
	>
		<div class="content">
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
		padding: 2rem;
		padding-bottom: 6rem;
		min-width: 400px;
		max-width: 90vw;
		max-height: 90vh;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		z-index: 9999;
		background-color: #1e1f24;
		border-radius: 16px;
	}

	.content {
		flex: 1;
	}

	.buttons {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		position: absolute;
		bottom: 1rem;
		left: 1rem;
		right: 1rem;
	}
</style>
