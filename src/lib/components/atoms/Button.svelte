<script>
	export let kind = 'secondary';
	$: type = 'button-' + kind;
	export let href = '#';
	export let fontsize = '1.2rem';
	export let icon = "";
</script>

<a href={href}>
	<div 
		class={type} 
		style="font-size: {fontsize};" 
	>
		<img src="icons/{icon}.svg" alt="{icon}"/>
		<slot/>
	</div>
</a>

<style>
	a {
		text-decoration: none;
		border-radius: 16px;
	}
	div, .button-secondary {
		height: 60px;
		width: max-content;
		color: var(--white);
		font-weight: 600;
		border: none;
		border-radius: 16px;
		padding: 16px 40px;
		display: block;
		cursor: pointer;
		background-color: var(--grey-two);
		transition: transform 0.4s var(--bezier-one), filter 0.4s var(--bezier-one);
		user-select: none;
	}

	.button-primary {
		background-color: var(--red);
		box-shadow: 0px 0px 32px 1px var(--red-glow);
		color: var(--grey-four)
	}

	div:hover {
		transform: translateY(-4%);
		filter: brightness(90%)
	}
	
	div, 
	.button-secondary {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem
	}

	img {
		height: 25px;
	}
</style>
