<script>
	export let kind = 'secondary';
	$: type = 'button-' + kind;
	export let href = '#';
</script>


<button class={type}>
	<a {href}>
		<slot/>
	</a>
</button>

<style>
	a {
		color: var(--white);
		text-decoration: none;
	} 

	button,
	.button-secondary {
		font-weight: 600;
		color: var(--white);
		border: 3px solid var(--red);
		border-radius: 200px;
		padding: 12px 40px;
		cursor: pointer;
		background-color: transparent;
		font-size: 1.5rem;
		margin-top: 45px;
		transform: translateX(-5%);
		transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
		transition-duration: 0.4s;
		margin-right: 20px;

	}

	.button-primary {
		background-color: var(--red);
		box-shadow: 0px 0px 32px 1px var(--red-glow);
	}

	.button-primary:hover {
		box-shadow: 0px 0px 32px 1px var(--red-glow), 0px 0px 32px 1px var(--red-glow);
	}

	button:hover {
		transform: translate(-5%, -5%);
	}
</style>
