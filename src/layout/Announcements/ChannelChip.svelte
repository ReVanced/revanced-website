<script lang="ts">
	import { goto } from '$app/navigation';
	import { derived, readable, type Readable } from 'svelte/store';
	import { building } from '$app/environment';
	import { page } from '$app/stores';

	export let channel: string;
	let searchParams: Readable<URLSearchParams>;

	if (building) searchParams = readable(new URLSearchParams());
	else searchParams = derived(page, ($page) => $page.url.searchParams);

	$: selected = $searchParams.get('channel') === channel;

	const handleClick = () => {
		const url = new URL(window.location.href);
		const params = new URLSearchParams(url.search);

		if (params.get('channel') === channel) {
			params.delete('channel');
			selected = false;
		} else {
			params.set('channel', channel);
			selected = true;
		}

		url.search = params.toString();
		goto(url.pathname + url.search);

		window.scrollTo({ top: 0, behavior: 'smooth' });
	};
</script>

<button class:selected on:click={handleClick}>{channel}</button>

<style>
	button {
		padding: 0.3rem 0.75rem;
		background: none;
		border: 1px solid var(--primary);
		border-radius: 0.6rem;
		color: var(--text-one);
		cursor: pointer;
		transition: all 0.2s var(--bezier-one);
	}

	button:hover,
	button.selected {
		background: var(--tertiary);
	}
</style>
