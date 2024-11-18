<script lang="ts">
	import { goto } from '$app/navigation';
	import { derived, readable, type Readable } from 'svelte/store';
	import { building } from '$app/environment';
	import { page } from '$app/stores';
	import Svg from '$lib/components/Svg.svelte';

	export let tag: string;
	export let clickable: boolean = true;

	let searchParams: Readable<URLSearchParams>;

	if (building) searchParams = readable(new URLSearchParams());
	else searchParams = derived(page, ($page) => $page.url.searchParams);

	$: selected = clickable && $searchParams.getAll('tag').includes(tag);

	const handleClick = () => {
		const url = new URL(window.location.href);
		const params = new URLSearchParams(url.search);

		if (params.getAll('tag').includes(tag)) params.delete('tag', tag);
		else params.append('tag', tag);

		url.search = params.toString();
		goto(url.pathname + url.search);

		window.scrollTo({ top: 0, behavior: 'smooth' });
	};
</script>

<button class:selected class:clickable on:click={clickable ? handleClick : null}>
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
