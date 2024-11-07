<script lang="ts">
	import { goto } from '$app/navigation';
	import { derived, readable, type Readable } from 'svelte/store';
	import { building } from '$app/environment';
	import { page } from '$app/stores';
	import Svg from '$lib/components/Svg.svelte';

	export let channel: string;
	export let clickable: boolean = true;

	let searchParams: Readable<URLSearchParams>;

	if (building) searchParams = readable(new URLSearchParams());
	else searchParams = derived(page, ($page) => $page.url.searchParams);

	$: selected = $searchParams.getAll('channel').includes(channel);

	const handleClick = () => {
		const url = new URL(window.location.href);
		const params = new URLSearchParams(url.search);

		if (params.getAll('channel').includes(channel)) params.delete('channel', channel);
		else params.append('channel', channel);

		url.search = params.toString();
		goto(url.pathname + url.search);

		window.scrollTo({ top: 0, behavior: 'smooth' });
	};
</script>

<button class:selected on:click={clickable ? handleClick : null}>
	{#if selected}
		<div class="icon">
			<Svg viewBoxHeight={48} svgHeight={18}>
				<path fill="currentColor" d="M18.9 36.4 7 24.5l2.9-2.85 9 9L38.05 11.5l2.9 2.85Z" />
			</Svg>
		</div>
	{/if}
	{channel}
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
		border: 1px solid var(--border);

		background-color: transparent;
		color: var(--text-four);

		letter-spacing: 0.02rem;
		font-size: 0.85rem;

		user-select: none;
		transition: all 0.2s var(--bezier-one);

		&:hover {
			background-color: var(--surface-three);
		}

		&.selected {
			background-color: var(--tertiary);
			border-color: transparent;
			color: var(--primary);

			.icon {
				display: inherit;
				margin-left: -6px;
				transition: none;
			}
		}
	}
</style>
