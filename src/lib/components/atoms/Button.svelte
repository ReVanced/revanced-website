<script>
	export let kind = 'secondary';
	$: type = 'button-' + kind;
	export let maxWidth = false;
	export let icon = '';
	export let href = '';
	export let capitalize = false;
	export let target = '';
</script>

<button on:click>
	{#if href}
		<a {href} {target}>
			<div class={type} class:capitalize style="width: {maxWidth ? '100%' : 'max-content'}">
				{#if icon}
					<img src="../icons/{icon}.svg" alt={icon} />
				{/if}
				<slot />
			</div>
		</a>
	{:else}
		<div class={type} class:capitalize style="width: {maxWidth ? '100%' : 'max-content'}">
			{#if icon}
				<img src="../icons/{icon}.svg" alt={icon} />
			{/if}
			<slot />
		</div>
	{/if}
</button>

<style>
	button {
		border: none;
		background-color: transparent;
	}

	a {
		text-decoration: none;
	}

	div,
	.button-secondary {
		min-width: max-content;
		min-height: 52px;
		font-size: 0.9rem;
		color: var(--white);
		font-weight: 600;
		border: none;
		border-radius: 12px;
		padding: 1rem 1.5rem;
		display: block;
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

	div,
	.button-secondary {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
	}

	img {
		height: 25px;
	}
</style>
