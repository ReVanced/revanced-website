<script>
	export let kind = 'secondary';
	$: type = 'button-' + kind;
	export let icon = '';
	export let href = '';
	export let capitalize = false;
	export let target = '';
</script>

<button on:click>
	<svelte:element
		this={href ? 'a' : 'div'}
		{href}
		{target}
		class={type}
		class:capitalize
	>
		{#if icon}
			<img src="../icons/{icon}.svg" alt={icon} />
		{/if}
		<slot />
	</svelte:element>
</button>

<style>
	button {
		border: none;
		background-color: transparent;
	}


	a,
	div {
		min-width: max-content;
		min-height: 57px;
		font-size: 0.9rem;
		text-decoration: none;
		color: var(--white);
		font-weight: 600;
		border: none;
		border-radius: 12px;
		padding: 1rem 1.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		background-color: var(--grey-two);
		transition: transform 0.4s var(--bezier-one), filter 0.4s var(--bezier-one);
		user-select: none;
	}

	.capitalize {
		text-transform: uppercase;
		letter-spacing: 0.03rem;
		font-weight: 700;
		font-size: 0.8rem;
	}

	.button-primary {
		background-color: var(--accent-color);
		box-shadow: 0px 0px 32px 1px var(--accent-color-glow);
		color: var(--grey-four);
	}

	div:hover {
		filter: brightness(85%);
	}

	img {
		height: 25px;
	}
</style>
