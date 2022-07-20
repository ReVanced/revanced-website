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
		font-weight: 600;
		color: var(--white);
		border: 3px solid var(--red);
		border-radius: 200px;
		padding: 12px 40px;
		cursor: pointer;
		background-color: transparent;
		font-size: 1.5rem;
		margin-top: 45px;
		transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		margin-right: 20px;
		user-select: none;
	}

	.button-primary {
		background-color: var(--red);
		box-shadow: 0px 0px 32px 1px var(--red-glow);
	}

	.button-primary:hover {
		box-shadow: 0px 0px 32px 1px var(--red-glow), 0px 0px 32px 1px var(--red-glow);
	}

	button:hover {
		transform: translate(0%, -5%);
	}
</style>
