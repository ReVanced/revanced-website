<script lang="ts">
	export let name: string;
	export let pfp: string;
	export let url: string;
	let alt = `${name}'s profile picture`;
</script>

<a href={url} rel="noreferrer" target="_blank">
	<button tabindex="-1">
		<img src={pfp} {alt} />
	</button>
	<h2>{name}</h2>
</a>

<style>
	a {
		color: var(--white);
		text-decoration: none;
		text-align: center;
		padding: 0.5rem 0.5rem;
		width: 100%;
		transition: all 0.3s var(--bezier-one);
		border: 1px solid var(--grey-three);
		border-radius: 4px;
		display:flex;
		gap: 1rem;
		align-items: center;
		background-color: var(--grey-six)
	}

	button {
		color: var(--white);
		border-radius: 50%;
		overflow: hidden;
		border: 0;
		height: 30px;
		width: 30px;
		min-width: 30px;
		min-height: 30px;
		cursor: pointer;
		background-color: transparent;
		transition: transform 0.4s var(--bezier-one);
		user-select: none;
	}

	a:hover {
		background-color: var(--accent-color);
	}

	a:hover > h2 {
		color: var(--grey-four);
	}

	h2 {
		font-size: 0.95rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	img {
		height: 100%;
		width: 100%;
	}
</style>
