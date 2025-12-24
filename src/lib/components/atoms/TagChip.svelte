<script lang="ts">
	import IconCheck from 'svelte-material-icons/Check.svelte';

	type Props = {
		tag: string;
		selected?: boolean;
		clickable?: boolean;
		onclick?: () => void;
	};

	let {
		tag,
		selected = false,
		clickable = true,
		onclick
	}: Props = $props();

	function handleClick() {
		if (clickable && onclick) {
			onclick();
		}
	}
</script>

<button
	type="button"
	class="tag-chip"
	class:selected={selected && clickable}
	class:clickable
	onclick={handleClick}
	disabled={!clickable}
>
	{#if selected && clickable}
		<span class="check-icon">
			<IconCheck size={16} />
		</span>
	{/if}
	{tag}
</button>

<style>
	.tag-chip {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		height: 32px;
		padding: 0 12px;
		border-radius: 8px;
		border: none;
		background-color: var(--tertiary);
		color: var(--text-four);
		font-size: 0.85rem;
		font-family: inherit;
		letter-spacing: 0.02em;
		cursor: default;
		user-select: none;
		transition: background-color 0.2s var(--bezier-one), 
		            border-color 0.2s var(--bezier-one),
		            color 0.2s var(--bezier-one);
	}

	.tag-chip.clickable {
		background-color: transparent;
		border: 1px solid var(--border);
		cursor: pointer;
	}

	.tag-chip.clickable:hover {
		background-color: var(--surface-three);
	}

	.tag-chip.clickable.selected {
		background-color: var(--tertiary);
		border-color: transparent;
		color: var(--primary);
	}

	.check-icon {
		display: flex;
		align-items: center;
		margin-left: -4px;
	}

	.check-icon :global(svg) {
		width: 16px;
		height: 16px;
	}

	.tag-chip:disabled {
		cursor: default;
	}
</style>
