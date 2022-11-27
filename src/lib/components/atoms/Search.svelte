<script lang="ts">
	export let title: string;
	export let searchTerm: string | null;
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
</script>

<div>
	<img src="../icons/search.svg" id="search" alt="Search" />
	{#if searchTerm}
		<img
			src="../icons/close.svg"
			id="clear"
			alt="Close"
			on:click={() => (searchTerm = null)}
			on:keypress={() => (searchTerm = null)}
			transition:fade|local={{ easing: quintOut, duration: 250 }}
		/>
	{/if}
	<input type="text" class:clear={searchTerm} placeholder={title} bind:value={searchTerm} />
</div>

<style>
	#search {
		position: absolute;
		height: 20px;
		transform: translate(60%, 60%);
	}

	#clear {
		position: absolute;
		z-index: 1;
		height: 20px;
		cursor: pointer;
		transform: translate(1060%, 60%);
	}

	.clear {
		padding-right: 2.5rem;
	}

	input {
		position: relative;
		display: flex;
		padding: 0.75rem 1rem;
		border-radius: 12px;
		border: 1px solid var(--grey-three);
		background-color: transparent;
		color: var(--grey-five);
		padding-left: 2.5rem;
		width: 100%;
	}
	input::placeholder {
		color: var(--grey-five);
	}

	input:focus {
		outline: 1px solid var(--accent-color);
	}
</style>
