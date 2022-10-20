<script>
	export let kind = 'secondary';
	$: type = 'button-' + kind;
	export let href = '#';
	export let width = 'false';
	export let icon = '';
</script>

<a {href}>
	<div class={type} style="width: {width ? '100%' : 'max-width'}">
		<img src="icons/{icon}.svg" alt={icon} />
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
		font-size: 1.1rem;
		height: 60px;
		color: var(--white);
		font-weight: 600;
		border: none;
		border-radius: 16px;
		padding: 16px 40px;
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
		transform: translateY(-4%);
		filter: brightness(90%);
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
