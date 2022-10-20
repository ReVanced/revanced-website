<script lang="ts">
	export let name: string;
	export let pfp: string;
	export let url: string;
	let alt = `${name}'s profile picture`
</script>

<a href={url} target="_blank">
	<button tabindex="-1">
		<img src={pfp} {alt}>
	</button>
	<h2>{name}</h2>
</a>

<style>
	a {
		color: var(--white);
		text-decoration: none;
		text-align: center;
		padding: 0.5rem 0.1rem;
		border-radius: 12px;
		width:100px;
		transition: all 0.3s var(--bezier-one);
	} 

	button {
		color: var(--white);
		border-radius: 50%;
		overflow: hidden;
        border: 0;
        width:45px;
        height:45px;
        max-height: 86px;
        max-width: 86px;
		cursor: pointer;
		background-color: transparent;
		transition: transform 0.4s var(--bezier-one);
		margin-bottom: 1rem;
		user-select: none;
	}

	a:hover  {
		background-color: var(--grey-three);
	}

	a:hover > h2 {
		color: var(--red);
	}

	h2 {
		font-size: 1rem;
		white-space: nowrap;
	 	overflow: hidden;
  		text-overflow: ellipsis;
	}

	img {
		height: 100%;
		width: 100%;
	}
</style>
