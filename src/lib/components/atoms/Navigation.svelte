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
		width: 140px;
		text-align: center;
		list-style: none;
		display: inline-block;
		position: relative;
		font-weight: 400;
		align-items: center;
		border: var(--grey-six);
		transition-timing-function: var(--bezier-one);
		transition-duration: 0.25s;
		padding: 10px 20px;
		border-radius: 200px;
	}

	a {
		color: var(--white);
		text-decoration: none;
		font-size: 1rem;
		user-select: none;
	}

	li:hover {
		font-weight: 700;
		border: 3px solid var(--grey-two);
	}

	li.selected	 {
		font-weight: 700;
		border: 3px solid var(--red);
	}
</style>
