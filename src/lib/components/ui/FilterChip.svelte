<script>
	import Check from 'svelte-material-icons/Check.svelte';
	import ChevronDown from 'svelte-material-icons/ChevronDown.svelte';

	let {
		dropdown = false,
		check = false,
		selected = false,
		children,
		onclick
	} = $props();
</script>

<button class:selected onclick={onclick}>
	{#if check}
		<Check size="18px" color="var(--surface-six)" />
	{/if}
	{@render children?.()}
	{#if dropdown}
		<ChevronDown size="18px" color="var(--surface-six)" />
	{/if}
</button>

<style lang="scss">
	button {
		font-family: var(--font-two);
		border: none;
		border: 1.5px solid var(--border);
		background-color: transparent;
		color: var(--text-four);
		height: 32px;
		padding: 0 16px;
		border-radius: 8px;
		font-size: 0.85rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 8px;
		
		&.selected {
			background-color: var(--tertiary);
			color: var(--primary);
		}
	}

</style>
