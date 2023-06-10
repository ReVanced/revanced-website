<script lang="ts">
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let title: string;
	export let searchTerm: string | null;
	export let searchTermFiltered: string | undefined;

	function clear() {
		searchTerm = '';
		searchTermFiltered = '';
		
		const url = new URL($page.url);
		url.searchParams.delete('s');
		goto(url.pathname + url.search);
	}
</script>

<div class="search-container">
	<img src="../icons/search.svg" id="search" alt="Search" />
	{#if searchTerm}
		<img
			src="../icons/close.svg"
			id="clear"
			alt="Clear"
			on:click={clear}
			on:keypress={clear}
			transition:fade|local={{ easing: quintOut, duration: 250 }}
		/>
	{/if}
	<input
		type="text"
		class:clear={searchTerm}
		placeholder={title}
		bind:value={searchTerm}
		on:keyup
	/>
</div>

<style>
	#search {
		/* umm dont ask */
		position: absolute;
		z-index: 1;
		left: 16px;
		top: 14px;
		height: 24px;
	}

	#clear {
		position: absolute;
		right: 16px;
		top: 14px;
		z-index: 1;
		height: 24px;
		cursor: pointer;
	}

	.search-container {
		position: relative;
	}

	input {
		position: relative;
		display: flex;
		padding: 1rem 3.25rem;
		width: 100%;
		color: var(--accent-color-two);
		font-weight: 500;
		font-size: 0.92rem;
		border-radius: 100px;
		border: none;
		background-color: var(--grey-ten);
	}

	input::placeholder {
		color: var(--grey-five);
		font-size: 0.9rem;
		font-weight: 500;
		transition: all 0.2s var(--bezier-one);
	}

	input:focus {
		outline: none;
	}

	input:focus::placeholder {
		outline: none;
		color: var(--accent-color);
	}
</style>
