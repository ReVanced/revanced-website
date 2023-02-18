<script>
	export let kind = 'secondary';
	$: type = 'button-' + kind;
	export let icon = '';
	export let href = '';
	export let target = '';
</script>

<button on:click>
	{#if href}
		<a
			{href}
			{target}
			{...$$restProps}
			class={type}
		>
			{#if icon}
				<img src="../icons/{icon}.svg" alt={icon} />
			{/if}
			<slot />
		</a>
	{:else}
		<div
			{...$$restProps}
			class={type}
		>
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
		padding: 0;
		margin: 0;
	}

	a,
	div {
		min-width: max-content;
		font-size: 0.95rem;
		text-decoration: none;
		color: var(--white);
		font-weight: 600;
		border: none;
		border-radius: 12px;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		transition: transform 0.4s var(--bezier-one), filter 0.4s var(--bezier-one);
		user-select: none;
	}

	.button-primary {
		background-color: var(--accent-color);
		color: var(--grey-four);
	}
	.button-secondary {
		background-color: var(--grey-two);
	}

	.button-primary, .button-secondary {
		padding: 16px 24px;
	}

	.button-tertiary {
		background-color: transparent;
		color: var(--accent-color);
		font-weight: 500;
		letter-spacing: 0.01rem;
	}

	div:hover {
		filter: brightness(85%);
	}

	img {
		height: 20px;
	}
</style>
