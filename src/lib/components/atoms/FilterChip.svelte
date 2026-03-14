<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { WithOptionalChildren } from '$types';
	import IconCheck from 'svelte-material-icons/Check.svelte';
	import IconChevronDown from 'svelte-material-icons/ChevronDown.svelte';


	type Props = {
		selected?: boolean;
		dropdown?: boolean;
		check?: boolean;
	} & WithOptionalChildren &
		HTMLButtonAttributes;

	let {
		selected = false,
		dropdown = false,
		check = false,
		children,
		...rest
	}: Props = $props();
</script>

<button class:selected {...rest}>
	{#if check && selected}
		<IconCheck size={18} class="chip-icon" />
	{/if}
	{#if children}
		{@render children()}
	{/if}
	{#if dropdown}
		<IconChevronDown size={18} class="chip-icon dropdown-icon" />
	{/if}
</button>

<style>
	button {
		font-family: inherit;
		border: 1.5px solid var(--border);
		background-color: transparent;
		color: var(--text-four);
		height: 32px;
		padding: 0 16px;
		border-radius: 8px;
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		transition:
			background-color 0.3s var(--bezier-one),
			color 0.3s var(--bezier-one),
			border-color 0.3s var(--bezier-one);
	}

	button:hover:not(.selected) {
		background-color: var(--surface-seven);
		border-color: var(--surface-six);
	}

	button.selected {
		background-color: var(--tertiary);
		color: var(--primary);
		border-color: var(--primary);
	}

	button :global(.chip-icon) {
		width: 18px;
		height: 18px;
		color: var(--surface-six);
	}

	button.selected :global(.chip-icon) {
		color: var(--primary);
	}

	button :global(.dropdown-icon) {
		margin-left: -4px;
	}
</style>
