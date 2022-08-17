<script>
	import { createEventDispatcher } from 'svelte';

	export let active = false;

	export let href = '#';

	const dispatch = createEventDispatcher();
</script>

<a {href}>
	<button class:active on:click={() => dispatch('click')} >
		<slot />
	</button>
</a>

<style>
	a {
		color: var(--white);
		text-decoration: none;
	}

	button {
		font-weight: 300;
		font-size: 1.4rem;
		height: 55px;
		width: 100%;
		color: var(--white);
		border-radius: 200px;
		border: 0;
		padding: 12px 40px;
		cursor: pointer;
		background-color: transparent;
		transition: background-color 0.4s var(--bezier-one), box-shadow 0.4s var(--bezier-one);
		user-select: none;
	}

	button.active {
		background-color: var(--red);
		box-shadow: 0px 0px 32px 1px var(--red-glow);
		font-weight: 600;
	}

	button:hover {
		background-color: var(--grey-two);
		font-weight: 400;
	}

	button.active:hover {
		background-color: var(--red);
		font-weight: 600;
	}
</style>
