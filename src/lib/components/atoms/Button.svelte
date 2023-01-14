<script>
	export let kind = 'secondary';
	$: type = 'button-' + kind;
	export let href = '';
	export let maxWidth = false;
	export let icon = '';
	export let target = '';
	export let unclickable = false;
</script>

<a {href} {target} on:click class:unclickable>
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
		transition: all 0.2s var(--bezier-one);
	}

	.unclickable {
		cursor: not-allowed;
		opacity: 0.4;
	}
	div,
	.button-secondary {
		min-width: max-content;
		font-size: 1rem;
		color: #FFD9E1;
		font-weight: 400;
		border: none;
		border-radius: 1200px;
		padding: 0.85rem 1.75rem;
		display: block;
		background-color: var(--grey-two);
		transition: transform 0.4s var(--bezier-one), filter 0.4s var(--bezier-one);
		user-select: none;
	}

	.button-primary {
		background-color: #FFB1C5;
		box-shadow: 0px 0px 32px 1px var(--accent-color-glow);
		color: #65002F;
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
