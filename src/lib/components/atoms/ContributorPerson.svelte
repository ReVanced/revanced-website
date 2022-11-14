<script lang="ts">
	export let name: string;
	export let pfp: string;
	export let url: string;
	let alt = `h`;

	let clicked = false;
	
</script>

<a href={url} rel="noreferrer" target="_blank" on:click={() => (clicked = !clicked)} class:clicked>
	<img src={pfp} {alt} />
	<h2>{name}</h2>
</a>

<style>
	a {
		color: var(--white);
		text-decoration: none;
		padding: 1rem;
		width: 100%;
		transition: all 0.3s var(--bezier-one);
		border-radius: 8px;
		display: flex;
		gap: 1rem;
		align-items: center;
		background-color: var(--grey-six);
		border: 1px solid var(--grey-three);
		cursor: pointer;
	}

	a:hover {
		background-color: var(--grey-one);
	}

	h2 {
		font-size: 0.95rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.clicked {
		background-color: var(--accent-color);
	}

	.clicked h2 {
		color: var(--grey-four);
	}

	.clicked:hover {
		background-color: var(--accent-color);
	}

	img {
		border-radius: 8px;
		height: 150px;
		width: 150px;
		background-color: var(--grey-two);
		transition: transform 0.4s var(--bezier-one);
		user-select: none;
	}

	@media screen and (max-width: 768px) {
		a {
			flex-direction: column;
		}
	}
</style>
