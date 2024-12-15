<script lang="ts">
	export let placeholder: string;
	export let required: boolean = false;
	export let value: any = '';
	export let type: string = 'text';

	export let onenter: () => void = () => {};
	export let onexit: () => void = () => {};
	export let oninput: () => void = () => {};
	export let onkeydown: (event: KeyboardEvent) => void = (event) => {};

	const set_type = (node: HTMLInputElement) => {
		node.type = type;
	};
</script>

<div class="input-wrapper">
	<input
		id={placeholder.toLowerCase()}
		name={placeholder.toLowerCase()}
		{required}
		use:set_type
		on:focus={onenter}
		on:blur={onexit}
		on:input={oninput}
		on:keydown={onkeydown}
		bind:value
	/>
	<label for={placeholder.toLowerCase()}>{placeholder}</label>
</div>

<style lang="scss">
	.input-wrapper {
		width: auto;
		height: auto;
		position: relative;

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

			&:focus + label,
			&:valid + label {
				top: -0.65rem;
				font-size: 0.85rem;
				background-color: var(--surface-seven);
				color: var(--text-one);
				padding: 0 0.3rem;
			}
		}
	}
</style>
