<script>
	import { page } from '$app/stores';
	export let href = '/';
	$: current = (href == $page.url.pathname);
</script>

<a {href}>
	<li class:selected="{current === true}">
		<slot/>
	</li>
</a>

<style>
	li {
		width: 160px;
		text-align: center;
		list-style: none;
		display: inline-block;
		position: relative;
		margin-left: 7px;
		margin-right: 7px;
		align-items: center;
		transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
		transition-duration: 0.25s;
	}

	a {
		color: var(--white);
		text-decoration: none;
		font-size: 1.25rem;
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
