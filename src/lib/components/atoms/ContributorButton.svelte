<script>
	export const username = "Ushie"
	export const href = `https://github.com/${username}`
	export const src = `https://github.com/${username}.png`
	export const alt = `${username}'s contributor profile picture`
</script>

<a {href}>
	<button>
		<img {src} {alt}><slot/>
	</button>
	<h3>{username}</h3>
</a>

<style>
	a {
		color: var(--white);
		text-decoration: none;
		text-align: center;
	} 

	button {
		color: var(--white);
		border-radius: 200px;
        border: 0;
		/* padding: 5px 5px; */
        width:86px;
        height:86px;
        max-height: 86px;
        max-width: 86px;
		cursor: pointer;
		background-color: var(--grey-four);
		font-size: 1.5rem;
		transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
		transition-duration: 0.4s;
		user-select: none;
	}

	button:hover {
		transform: translate(0%, -5%);
	}

	img {
		/* margin: 0;
		padding: 0; */
		border-radius: 50%;
        max-height: 86px;
        max-width: 86px;
	}
</style>
