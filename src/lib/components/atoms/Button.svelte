<script>
	export let kind = 'secondary';
	$: type = 'button-' + kind;
	export let maxWidth = false;
	export let icon = '';
	export let alt = '';
	export let unclickable = false;
</script>

<button class={type} class:unclickable on:click|stopPropagation style="width: {maxWidth ? '100%' : 'max-content'}">
	{#if icon}
		<img src={icon} {alt} />
	{/if}
	<slot />
</button>

<style>
	button {
		cursor: pointer;
		text-decoration: none;
		border-radius: 16px;
		transition: all 0.2s var(--bezier-one);
	}

	.unclickable {
		cursor: not-allowed;
		opacity: 0.25;
	}

	button,
	.button-secondary,
	.button-circle,
	.button-text {
		min-width: max-content;
		font-size: 1rem;
		color: #ffd9e1;
		font-weight: 400;
		border: none;
		border-radius: 1200px;
		padding: 0.85rem 1.75rem;
		display: block;
		background-color: var(--grey-two);
		transition: transform 0.4s var(--bezier-one), filter 0.4s var(--bezier-one);
		user-select: none;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
	}

	.button-text {
		background-color: transparent;
		padding: 0;
		color: #ef96ac;
	}

	.button-icon {
		background-color: transparent;
		height: 24px;
		width: 24px;
		padding: 0;
	}


	.button-primary {
		background-color: #ffb1c5;
		box-shadow: 0px 0px 32px 1px var(--accent-color-glow);
		color: #65002f;
	}

	button:hover {
		filter: brightness(85%);
	}

	img {
		height: 25px;
	}

	.button-circle {
		padding: 0.85rem;
	}

</style>
