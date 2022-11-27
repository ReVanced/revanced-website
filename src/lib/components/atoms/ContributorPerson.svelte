<script lang="ts">
	export let name: string;
	export let pfp: string;
	export let url: string;
	let alt = `${name}'s profile picture`;
</script>

<a href={url} rel="noreferrer" target="_blank">
	<img src={pfp} {alt} />
	<h4>{name}</h4>
</a>

<style>
	a {
		color: var(--white);
		text-decoration: none;
		padding: 0.5rem;
		width: 100%;
		transition: all 0.3s var(--bezier-one);
		border-radius: 4px;
		display: flex;
		gap: 1rem;
		align-items: center;
		background-color: var(--grey-six);
		border: 1px solid var(--grey-three);
	}


	a:hover {
		background-color: var(--accent-color);
	}

	a:hover > h4 {
		color: var(--grey-four);
	}

	h4 {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	img {
		border-radius: 50%;
		height: 30px;
		width: 30px;
		background-color: var(--grey-two);
		transition: transform 0.4s var(--bezier-one);
		user-select: none;
	}
</style>
