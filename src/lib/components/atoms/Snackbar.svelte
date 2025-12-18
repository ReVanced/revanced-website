<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	type Props = {
		open?: boolean;
		text?: Snippet;
		duration?: number;
	};

	let { open = $bindable(false), text, duration = 3000 }: Props = $props();

	$effect(() => {
		if (open && duration > 0) {
			const timer = setTimeout(() => {
				open = false;
			}, duration);

			return () => clearTimeout(timer);
		}
	});
</script>

{#if open}
	<div
		class="snackbar-container"
		transition:fade={{ duration: 200 }}
	>
		<div
			class="snackbar"
			in:fly={{ y: 20, duration: 300 }}
			out:fly={{ y: 20, duration: 200 }}
		>
			{#if text}
				{@render text()}
			{/if}
		</div>
	</div>
{/if}

<style>
	.snackbar-container {
		position: fixed;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: var(--z-toast);
		pointer-events: none;
	}

	.snackbar {
		background-color: var(--surface-three);
		color: var(--text-one);
		padding: 1rem 1.5rem;
		border-radius: 8px;
		box-shadow: 
			0px 4px 5px 0px rgba(0, 0, 0, 0.14),
			0px 1px 10px 0px rgba(0, 0, 0, 0.12),
			0px 2px 4px -1px rgba(0, 0, 0, 0.2);
		font-size: 0.95rem;
		font-weight: 500;
		min-width: 200px;
		max-width: 400px;
		text-align: center;
	}

	@media (max-width: 480px) {
		.snackbar-container {
			bottom: 1rem;
			left: 1rem;
			right: 1rem;
			transform: none;
		}

		.snackbar {
			width: 100%;
			max-width: none;
		}
	}
</style>
