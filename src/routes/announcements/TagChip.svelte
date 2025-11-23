<script lang="ts">
	import Check from 'svelte-material-icons/Check.svelte';

	let { tag, clickable = true, selected: selectedProp = false, onClick = () => {} }: { tag: string; clickable?: boolean; selected?: boolean; onClick?: (event?: MouseEvent) => void } = $props();

	const selected = $derived(clickable && selectedProp);
</script>

<button class:selected class:clickable onclick={clickable ? onClick : () => {}}>
	{#if selected && clickable}
		<div class="icon">
			<Check />
		</div>
	{/if}
	{tag}
</button>

<style lang="scss">
	button {
		display: flex;
		justify-content: center;
		align-items: center;

		gap: 8px;
		height: 32px;
		padding: 0 12px;

		border-radius: 8px;
		border: none;

		background-color: var(--tertiary);
		color: var(--text-four);

		letter-spacing: 0.02rem;
		font-size: 0.85rem;

		user-select: none;
		transition: all 0.2s var(--bezier-one);

		&.clickable {
			background-color: transparent;
			border: 1px solid var(--border);

			&.selected {
				border-color: transparent;
				background-color: var(--tertiary);
				color: var(--primary);

				.icon {
					display: inherit;
					margin-left: -6px;
					transition: none;
				}
			}

			&:hover {
				background-color: var(--surface-three);
			}
		}
	}
</style>
