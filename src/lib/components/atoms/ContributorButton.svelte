<script lang="ts">
	export let username: string;
	export let pfp: string;
	export let url: string;
	let alt = `${username}'s contributor profile picture`
</script>

<a href={url} target="_blank">
	<button>
		<img src={pfp} alt={alt}><slot/>
	</button>
	<h2>{username}</h2>
</a>

<style>
	a {
		color: var(--white);
		text-decoration: none;
		text-align: center;
		padding: 0.5rem;
		border-radius: 12px;
		transition: all 0.3s var(--bezier-one);
	} 

	button {
		color: var(--white);
		border-radius: 200px;
		overflow: hidden;
        border: 0;
        width:45px;
        height:45px;
        max-height: 86px;
        max-width: 86px;
		cursor: pointer;
		background-color: var(--grey-four);
		transition: transform 0.4s var(--bezier-one);
		margin-bottom: 1rem;
		user-select: none;
	}

	a:hover  {
		background-color: var(--grey-one);
	}

	h2 {
		font-size: 1rem;
	}

	img {
		height: 100%;
		width: 100%;
	}
</style>
