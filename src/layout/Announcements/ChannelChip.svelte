<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	export let channel: string;

	$: selected = false;

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		if (params.get('channel') === channel) selected = true;
	});

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

<button class:selected on:click={handleClick}>
	{selected ? 'x ' : ''}{channel}
</button>

<style>
</style>
