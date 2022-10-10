<script>
	export let kind = 'secondary';
	$: type = 'button-' + kind;
	export let href = '#';
	export let fontsize = '1.2rem';
	export let icon = "";

	function handleClick() {
		location.href = href;
	}
</script>

<button 
	class={type} 
	style="font-size: {fontsize};" 
	on:click={handleClick}
>
	<img src="icons/{icon}.svg" alt="{icon}"/>
	<slot/>
</button>

<style>
	button,
	.button-secondary {
		color: var(--white);
		text-decoration: none;
		font-weight: 600;
		border: none;
		border-radius: 16px;
		padding: 12px 40px;
		display: block;
		cursor: pointer;
		background-color: var(--grey-two);
		transition: transform 0.4s var(--bezier-one), box-shadow 0.4s var(--bezier-one);
		user-select: none;
	}

	.button-primary {
		border: 3px solid var(--red);
		background-color: var(--red);
		box-shadow: 0px 0px 32px 1px var(--red-glow);
		color: var(--grey-four)
	}

	button:hover {
		transform: translateY(-5%);
	}
	button:active {
		transform: scale(98%);
	}

	button, 
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
