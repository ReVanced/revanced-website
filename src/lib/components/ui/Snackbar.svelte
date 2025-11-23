<script lang="ts">
	import { backIn, expoOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	let {
		open = $bindable(false),
		dismissTime = 3000,
		text
	}: {
		open?: boolean;
		dismissTime?: number;
		text?: any;
	} = $props();

	let timeout: ReturnType<typeof setTimeout>;
	$effect(() => {
		if (open) {
			clearTimeout(timeout);
			timeout = setTimeout(() => (open = false), dismissTime);
		}
	});
</script>

{#if open}
	<div id="snackbar" in:slide={{ duration: 400, easing: expoOut }} out:slide={{ duration: 300, easing: backIn }}>
		{@render text?.()}
	</div>
{/if}

<style>
	#snackbar {
		display: flex;
		align-items: center;

		position: fixed;
		bottom: 2rem;
		left: 2rem;
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;

		min-width: 12.5rem;
		max-width: 35rem;
		height: 3rem;

		background: var(--surface-one);
		color: var(--text-two);
		box-shadow: var(--drop-shadow-one);

		font-size: 14px;
		font-weight: 500;
		z-index: 10;
	}
</style>
