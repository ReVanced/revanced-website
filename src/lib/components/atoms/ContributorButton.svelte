<script>
	export let href = "https://github.com/ushie"
	export let src = "https://github.com/ushie.png"
	export let alt = "Contributors Image"
</script>

<a {href}>
	<button>
		<img {src} {alt}><slot/>
	</button>
</a>

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
        width:86px;
        height:86px;
        max-height: 86px;
        max-width: 86px;
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

	img {
		border-radius: 50%;
        max-height: 86px;
        max-width: 86px;
	}
</style>
