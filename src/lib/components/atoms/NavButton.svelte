<script>
  import RouterEvents from '../../../data/RouterEvents';
	export let href = '/';
  export let is_selected = target_url => href === target_url;
</script>

<a data-sveltekit-prefetch {href}>
	<li class:selected={is_selected($RouterEvents.target_url.pathname)}>
		<slot />
	</li>
</a>

<style>
	li {
		border: var(--grey-six);
		text-align: center;
		list-style: none;
		display: inline-block;
		position: relative;
		font-weight: 500;
		font-size: 0.9rem;
		align-items: center;
		border: var(--grey-six);
		transition-timing-function: var(--bezier-one);
		transition-duration: 0.25s;
		padding: 10px 25px;
		border-radius: 200px;
	}

	a {
		color: var(--grey-five);
		text-decoration: none;
		font-size: 1rem;
		user-select: none;
		border-radius: 200px;
	}

	li:hover {
		color: var(--white);
		background-color: var(--grey-one);
	}

	li.selected {
		background-color: var(--grey-two);
		color: var(--accent-color);
	}
</style>
