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
		height: 60px;
		width: 43vw;
		color: var(--white);
		border-radius: 200px;
		border: 0;
		padding: 12px 40px;
		cursor: pointer;
		background-color: transparent;
		font-size: 1.5rem;
		transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
		transition-duration: 0.4s;
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
