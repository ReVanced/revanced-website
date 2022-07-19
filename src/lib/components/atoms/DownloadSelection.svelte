<script>
	export let kind = 'secondary';
	$: type = 'button-' + kind;
	export let href = '#';
</script>

<a {href}>
	<button class={type}>
			<slot/>
	</button>
</a>

<style>
	a {
		color: var(--white);
		text-decoration: none;
	} 

	button,
	.button-secondary {
		font-weight: 300;
        height:60px;
        width:20vw;
		color: var(--white);
		border-radius: 200px;
        border:0;
		padding: 12px 40px;
		cursor: pointer;
		background-color: transparent;
		font-size: 1.5rem;
		transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
		transition-duration: 0.4s;
		user-select: none;
	}

	.button-primary {
		background-color: var(--red);
		box-shadow: 0px 0px 32px 1px var(--red-glow);
	}

	button:hover {
		background-color: var(--grey-two);
        font-weight:500;
	}
</style>
