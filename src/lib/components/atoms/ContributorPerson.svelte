<script lang="ts">
	export let name: string;
	export let pfp: string;
	export let url: string;
	let alt = `${name}'s profile picture`;
</script>

<a href={url} rel="noreferrer" target="_blank">
	<img src={pfp} {alt} />
	<h5>{name}</h5>
</a>

<style>
	a {
		color: var(--white);
		text-decoration: none;
		padding: 0.5rem;
		width: 100%;
		transition: background-color 0.3s var(--bezier-one);
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

	a:hover > h5 {
		color: var(--grey-four);
	}

	h5 {
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

	@media (max-width: 768px) {
		h5 {
			display: none;
		}

		img {
			height: 48px;
			width: 48px;
		}
		a {
			border-radius: 16px;
			width: max-content;
			background-color: transparent;
			border: none;
		}

	}
</style>
