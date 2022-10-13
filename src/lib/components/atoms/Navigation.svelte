<script>
	import { page } from '$app/stores';
	export let href = '/';
	$: current = (href === $page.url.pathname);
</script>

<a {href}>
	<li class:selected="{current === true}">
		<slot/>
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

	li.selected	 {
		background-color: var(--grey-three);
		color: var(--red)
	}
</style>
