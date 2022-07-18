<script>
	export let href = '#';
</script>


<button>
	<a {href}>
		<slot/>
	</a>
</button>

<style>
	a {
		color: var(--white);
		text-decoration: none;
	} 

	button {
		color: var(--white);
		border-radius: 200px;
        border: 0;
		padding: 5px 5px;
        width:128px;
        height:128px;
        max-height: 128px;
        max-width: 128px;
		cursor: pointer;
		background-color: var(--grey-four);
		font-size: 1.5rem;
		transform: translateX(-5%);
		transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
		transition-duration: 0.4s;
		user-select: none;
	}

	button:hover {
		transform: translate(-5%, -5%);
	}
</style>
