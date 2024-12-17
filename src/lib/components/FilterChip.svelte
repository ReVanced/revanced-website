<script>
	import Check from 'svelte-material-icons/Check.svelte';
	import ChevronDown from 'svelte-material-icons/ChevronDown.svelte';

	export let dropdown = false;
	export let check = false;
	export let selected = false;
</script>

<button class:selected on:click>
	{#if check}
		<div id="check" class="material-icon-container">
			<Check size="18px" />
		</div>
	{/if}
	<slot />
	{#if dropdown}
		<div id="dropdown" class="material-icon-container">
			<ChevronDown size="18px" />
		</div>
	{/if}
</button>

<style>
	button {
		font-family: var(--font-two);
		border: none;
		border: 1.5px solid var(--border);
		background-color: transparent;
		color: var(--text-four);
		height: 32px;
		padding: 0 16px;
		border-radius: 8px;
		font-size: 0.85rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.selected {
		background-color: var(--tertiary);
		color: var(--primary);
	}

	.material-icon-container {
		color: var(--surface-six);
	}

	#dropdown {
		margin-right: -6px;
	}

	#check {
		margin-left: -6px;
	}
</style>
