<script lang="ts">
	import { slide, fade } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';

	export let open = false;
	export let dismissTime = 3000;

	let timeout: ReturnType<typeof setTimeout>;
	$: if (open) {
		clearTimeout(timeout);
		timeout = setTimeout(() => (open = false), dismissTime);
	}
</script>

{#if open}
	<div
		class="snackbar"
		in:slide={{ duration: 400, easing: expoOut }}
		out:fade={{ duration: 300, easing: expoOut }}
	>
		<div class="text">
			<slot name="text" />
		</div>
	</div>
{/if}

<style lang="scss">
	.snackbar {
		display: flex;
		box-sizing: border-box;
		justify-content: space-between;
		padding-top: 0.25rem;
		padding-bottom: 0.25rem;
		padding-left: 1rem;
		padding-right: 0.5rem;
		height: 3rem;
		gap: 1.5rem;
		align-items: center;
		border-radius: 0.25rem;
		min-width: 12.5rem;
		max-width: 35rem;
		position: fixed;
		margin-left: 2.25rem;
		margin-right: 2.25rem;
		z-index: 9999;
		left: 0;
		right: 0;
		bottom: 2rem;
		background-color: var(--surface-one);
		transition: all 0.4s var(--bezier-one);
		box-shadow: var(--drop-shadow-one);
	}

	.text {
		color: var(--text-two);
		font-weight: 500;
		font-size: 14px;
	}
</style>
