<script>
	export let kind = 'secondary';
	$: type = 'button-' + kind;
	export let href = '#';
	export let fontsize = '1.2rem';

</script>

<a {href}>
	<button class={type} style="font-size: {fontsize};">
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
		border: 3px solid var(--grey-three);
		border-radius: 200px;
		padding: 12px 40px;
		cursor: pointer;
		background-color: transparent;
		margin-top: 45px;
		transition: transform 0.4s var(--bezier-one), box-shadow 0.4s var(--bezier-one);
		user-select: none;
	}

	.button-primary {
		border: 3px solid var(--red);
		background-color: var(--red);
		box-shadow: 0px 0px 32px 1px var(--red-glow);
	}

	.button-primary:hover {
		box-shadow: 0px 0px 32px 1px var(--red-glow), 0px 0px 32px 1px var(--red-glow);
	}

	button:hover {
		transform: translate(0%, -5%);
	}
	button:active {
		transition-duration: 0.1s;
		transform: translate(0);
	}
</style>
