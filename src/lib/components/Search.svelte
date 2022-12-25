<script lang="ts">
	export let title: string;
	export let searchTerm: string | null;
	export let searchTermFiltered: string | null;
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	function clear() {
		searchTerm = null;
		searchTermFiltered = null;
	}
</script>

<div>
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
		left: 23px;
		top: 52px;
		height: 24px;
	}

	#clear {
		position: absolute;
		right: 42px;
		top: 52px;
		z-index: 1;
		height: 24px;
		cursor: pointer;
	}

	.clear {
		padding-right: 2.5rem;
	}

	input {
		position: relative;
		display: flex;
		padding: 1rem 3rem;
		width: 100%;
	}
	input::placeholder {
		color: var(--grey-eight);
		font-size: 0.9rem;
	}

	@media (max-width: 768px) {
		#search {
			left: 26px;
			top: 38px;
		}

		#clear {
			right: 26px;
			top: 38px;
		}
	
		input {
			background-color: var(--grey-ten);
			border: none;
			border-radius: 100px;
		}	
	}
</style>
