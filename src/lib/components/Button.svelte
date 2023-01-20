<script>
	export let kind = 'two';
	$: type = 'button-' + kind;
	export let icon = '';
	export let href = '';
	export let target = '';
</script>

<button on:click>
	{#if kind !== 'three'}
		<div id="overlay" />
		<div id="ripple" />
	{/if}
	<svelte:element this={href ? 'a' : 'div'} {href} {target} class={type}>
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
		padding: 0;
		margin: 0;
		position: relative;
		overflow: hidden;
		border-radius: 100px;
	}

	a,
	div {
		min-width: max-content;
		font-size: 0.85rem;
		height: 44px;
		text-decoration: none;
		color: var(--white);
		font-weight: 500;
		border: none;
		border-radius: 100px;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		transition: transform 0.4s var(--bezier-one), filter 0.4s var(--bezier-one);
		user-select: none;
		--webkit-user-select: none;
	}

	#ripple,
	#overlay {
		position: absolute;
		margin-left: auto;
		margin-right: auto;
		opacity: 0;
		left: 0;
		right: 0;
		height: 100%;
		transition: all 0.2s var(--bezier-one);
		pointer-events: none;
	}

	#ripple {
		aspect-ratio: 1 / 1;
		margin: auto;
		border-radius: 100px;
		background-color: rgba(255, 255, 255, 0.1);
	}

	#overlay {
		width: 100%;
		background-color: rgba(255, 255, 255, 0.05);
	}

	button:hover #overlay {
		opacity: 1;
	}
	button:active #ripple {
		opacity: 1;
		animation: ripple 1.5s forwards ease-out;
	}

	@keyframes ripple {
		to {
			transform: scale(10);
			opacity: 0;
		}
	}

	.button-one {
		background-color: var(--accent-color);
		color: var(--grey-four);
	}
	.button-two {
		background-color: var(--grey-two);
	}

	.button-one,
	.button-two,
	.button-four {
		padding: 18px 28px;
	}

	.button-three {
		background-color: transparent;
		color: var(--accent-color);
		font-weight: 500;
	}

	.button-four {
		background-color: transparent;
		border: 1px solid var(--grey-three);
		color: var(--accent-color);
		font-weight: 500;
	}
	div:hover {
		filter: brightness(85%);
	}

	img {
		height: 20px;
	}
</style>
