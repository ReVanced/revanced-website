<script>
	export let kind = 'secondary';
	$: type = 'button-' + kind;
	export let href = '#';
	export let maxWidth = false;
	export let icon = '';
	export let target = '';
</script>

<a {href} {target}>
	<div class={type} style="width: {maxWidth ? '100%' : 'max-content'}">
		{#if icon}
			<img src="../icons/{icon}.svg" alt={icon} />
		{/if}
		<slot />
	</div>
</a>

<style>
	a {
		text-decoration: none;
		border-radius: 16px;
	}

	div,
	.button-secondary {
		min-width: max-content;
		font-size: 1rem;
		color: var(--white);
		font-weight: 600;
		border: none;
		border-radius: 12px;
		padding: 1rem 1.75rem;
		display: block;
		cursor: pointer;
		background-color: var(--grey-two);
		transition: transform 0.4s var(--bezier-one), filter 0.4s var(--bezier-one);
		user-select: none;
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
