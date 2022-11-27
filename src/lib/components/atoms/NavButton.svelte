<script>
	import RouterEvents from '../../../data/RouterEvents';
	export let href = '/';
	export let is_selected = (target_url) => href === target_url;
</script>

<a data-sveltekit-prefetch {href}>
	<li class:selected={is_selected($RouterEvents.target_url.pathname)}>
		<h5>
			<slot />
		</h5>
	</li>
</a>

<style>
	li {
		border: var(--grey-six);
		text-align: center;
		list-style: none;
		position: relative;
		font-weight: 500;
		font-size: 1rem;
		align-items: center;
		border: var(--grey-six);
		transition-timing-function: var(--bezier-one);
		transition-duration: 0.25s;
		padding: 10px 25px;
		border-radius: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
	}



	a {
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

	li.selected h5 {
		color: var(--accent-color);
	}

	@media (max-width: 768px) {
		li {
			padding: 1rem 1.5rem;
			text-align: left;
			justify-content: left;
			border-radius: 16px;
			font-size: 1.2rem;
		}

		li.selected {
			background-color: var(--accent-color);
		}

		li.selected h5 {
			color: var(--grey-four);
		}
	}
</style>
