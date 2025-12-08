<script lang="ts">
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import IconSearch from 'virtual:icons/material-symbols/search';
	import IconClose from 'virtual:icons/material-symbols/close';

	type Props = {
		value?: string;
		placeholder?: string;
	} & Omit<HTMLInputAttributes, 'value' | 'type' | 'placeholder'>;

	let {
		value = $bindable(''),
		placeholder = 'Search...',
		...rest
	}: Props = $props();

	function clear() {
		value = '';
	}
</script>

<div class="search-container">
	<div class="search-icon">
		<IconSearch />
	</div>
	{#if value}
		<button
			type="button"
			class="clear-button"
			onclick={clear}
			aria-label="Clear search"
			transition:fade={{ easing: quintOut, duration: 250 }}
		>
			<IconClose />
		</button>
	{/if}
	<input
		type="text"
		class:clear={value}
		{placeholder}
		bind:value
		{...rest}
	/>
</div>

<style>
	.search-container {
		position: relative;
	}

	.search-icon {
		position: absolute;
		z-index: 1;
		left: 16px;
		top: 14px;
		height: 24px;
		width: 24px;
		color: var(--surface-six);
		pointer-events: none;
	}

	.search-icon :global(svg) {
		width: 24px;
		height: 24px;
	}

	.clear-button {
		position: absolute;
		right: 16px;
		top: 14px;
		z-index: 1;
		height: 24px;
		width: 24px;
		cursor: pointer;
		background: none;
		border: none;
		padding: 0;
		color: var(--surface-six);
	}

	.clear-button :global(svg) {
		width: 24px;
		height: 24px;
	}

	input {
		position: relative;
		display: flex;
		padding: 1rem 3.25rem;
		width: 100%;
		color: var(--secondary);
		font-weight: 500;
		font-size: 0.92rem;
		font-family: inherit;
		border-radius: 100px;
		border: none;
		background-color: var(--surface-nine);
		outline: none;
		transition: background-color 0.3s var(--bezier-one);
	}

	input:hover {
		background-color: var(--surface-five);
	}

	input:focus {
		background-color: var(--surface-two);
	}

	input::placeholder {
		color: var(--text-four);
		font-size: 0.9rem;
		font-weight: 500;
		transition: all 0.2s var(--bezier-one);
	}

	input:focus::placeholder {
		color: var(--primary);
	}
</style>
