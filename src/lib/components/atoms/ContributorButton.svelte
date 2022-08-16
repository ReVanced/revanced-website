<script lang="ts">
	export let username: String;
	let href = `https://github.com/${username}`
	let src = `https://github.com/${username}.png`
	let alt = `${username}'s contributor profile picture`
</script>

<a {href}>
	<button>
		<img {src} {alt}><slot/>
	</button>
	<h2>{username}</h2>
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
		overflow: hidden;
        border: 0;
		/* padding: 5px 5px; */
        width:86px;
        height:86px;
        max-height: 86px;
        max-width: 86px;
		cursor: pointer;
		background-color: var(--grey-four);
		transition: transform 0.4s var(--bezier-one);
		margin-bottom: 1rem;
		user-select: none;
	}

	a:hover > button {
		transform: translateY(-5%);
	}

	img {
		height: 100%;
		width: 100%;
	}
</style>
