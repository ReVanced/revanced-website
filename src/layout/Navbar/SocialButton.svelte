<script>
	export let src = 'github';
	export let href = '#';
</script>

<a {href} rel="noreferrer" target="_blank">
	<svg
		height="20"
		width="20"
		xmlns="http://www.w3.org/2000/svg"
		preserveAspectRatio="none"
		viewBox="0 0 407 407"
	>
		<use xlink:href="socials/{src}.svg#main" />
	</svg>
</a>

<style>
	a:hover {
		color: var(--accent-color-two);
	}

	a {
		background-color: transparent;
		border: none;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		color: var(--grey-five);
	}
</style>
