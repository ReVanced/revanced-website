<script>
	export let dropdown = false;
	export let check = false;
	export let selected = false;
</script>

<button class:selected on:click>
	{#if check}
		<img id="check" src="/icons/check.svg" alt="selected" />
	{/if}
	<slot />
	{#if dropdown}
		<img id="dropdown" src="/icons/expand_more.svg" alt="dropdown" />
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

	img {
		height: 18px;
	}

	#dropdown {
		margin-right: -6px;
	}

	#check {
		margin-left: -6px;
	}
</style>
