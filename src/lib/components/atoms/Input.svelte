<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = {
		placeholder: string;
		value?: string;
		required?: boolean;
		type?: string;
		onenter?: () => void;
		onexit?: () => void;
		oninput?: () => void;
		onkeydown?: (event: KeyboardEvent) => void;
	} & Omit<HTMLInputAttributes, 'value' | 'type' | 'placeholder' | 'required'>;

	let {
		placeholder,
		value = $bindable(''),
		required = false,
		type = 'text',
		onenter,
		onexit,
		oninput,
		onkeydown,
		...rest
	}: Props = $props();

	let inputId = $derived(placeholder.toLowerCase().replace(/\s+/g, '-'));
</script>

<div class="input-wrapper">
	<input
		id={inputId}
		name={inputId}
		{required}
		{type}
		bind:value
		onfocus={onenter}
		onblur={onexit}
		{oninput}
		{onkeydown}
		{...rest}
	/>
	<label for={inputId}>{placeholder}</label>
</div>

<style>
	.input-wrapper {
		width: auto;
		height: auto;
		position: relative;
	}

	label {
		position: absolute;
		top: 29%;
		left: 1rem;
		transition: all 0.2s ease-in-out;
		color: var(--surface-six);
		pointer-events: none;
		padding: 0;
		margin: 0;
		font-size: 1rem;
	}

	input {
		font-size: 1rem;
		width: 100%;
		height: 100%;
		font-family: inherit;
		padding: 1rem;
		border: 1px solid var(--border);
		border-radius: 8px;
		background-color: var(--surface-seven);
		color: var(--text-one);
		outline: none;
		transition: border-color 0.2s ease;
	}

	input:focus {
		border-color: var(--primary);
	}

	input:focus + label,
	input:valid + label {
		top: -0.65rem;
		font-size: 0.85rem;
		background-color: var(--surface-seven);
		color: var(--text-one);
		padding: 0 0.3rem;
	}
</style>
