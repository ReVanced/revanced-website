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
		width: 150px;
		text-align: center;
		list-style: none;
		display: inline-block;
		position: relative;
		font-weight: 300;
		margin-left: 0.5rem;
		margin-right: 0.5rem;
		align-items: center;
		border: var(--grey-six);
		transition-timing-function: var(--bezier-one);
		transition-duration: 0.25s;
	}

	a {
		color: var(--white);
		text-decoration: none;
		font-size: 1.1rem;
		user-select: none;
	}

	li:hover {
		font-weight: 600;
		border: 3px solid var(--grey-two);
		padding: 10px 30px;
		border-radius: 200px;
	}

	li.selected	 {
		font-weight: 600;
		border: 3px solid var(--red);
		padding: 10px 30px;
		border-radius: 200px;
	}
</style>
