<script>
	export let src = 'github';
	export let href = '#';
</script>

<a {href}>
	<div>
		<img src="socials/{src}.svg" alt={src} />
	</div>
</a>

<style>
	div {
		border: 0;
		width: 60px;
		height: 60px;
		padding: 14px;
		cursor: pointer;
		border-radius: 200px;
		transition: transform 0.4s var(--bezier-one);
		background-color: var(--grey-two);
		color: var(--white);
		user-select: none;
	}

	div {
		display: flex;
		justify-content: center;
	}

	img {
		transition: filter 0.4s var(--bezier-one);
		width: 30px;
	}

	div:hover {
		transform: translateY(-5%);
	}

	div:hover img {
		filter: brightness(1.2);
	}
</style>
