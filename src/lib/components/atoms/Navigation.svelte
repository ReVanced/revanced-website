<script>
	import { page } from '$app/stores';
	export let href = '/';
	$: current = (href == $page.url.pathname);

</script>

<li class:selected="{current === true}"><a {href}><slot/></a></li>

<style>
	li {
		width: 160px;
		text-align: center;
		list-style: none;
		display: inline-block;
		position: relative;
		align-items: center;
	}

	a {
		color: var(--white);
		text-decoration: none;
		font-size: 1.25rem;
	}

	li:hover {
		font-weight: 500;
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
