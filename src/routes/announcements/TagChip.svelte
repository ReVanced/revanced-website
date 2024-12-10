<script lang="ts">
	import Svg from '$lib/components/Svg.svelte';

	export let tag: string;
	export let clickable: boolean = true;
	export let selected: boolean = false;
	export let onClick: (event?: MouseEvent) => void = () => {};

	selected = clickable && selected;
</script>

<button class:selected class:clickable on:click={clickable ? onClick : () => {}}>
	{#if selected && clickable}
		<div class="icon">
			<Svg viewBoxHeight={48} svgHeight={18}>
				<path fill="currentColor" d="M18.9 36.4 7 24.5l2.9-2.85 9 9L38.05 11.5l2.9 2.85Z" />
			</Svg>
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
		padding: 0 16px;

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
