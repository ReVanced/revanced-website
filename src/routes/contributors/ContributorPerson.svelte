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
		cursor: pointer;
		padding: 0.9rem 1rem;
		width: 100%;
		transition: background-color 0.3s var(--bezier-one);
		display: flex;
		gap: 1rem;
		align-items: center;
		border-right: 1px solid var(--grey-three);
		border-bottom: 1px solid var(--grey-three);
	}

	a:hover {
		text-decoration: underline var(--accent-color);
		color: var(--white);
	}

	h5 {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding: 0.25rem 0;
	}

	img {
		border-radius: 50%;
		height: 32px;
		width: 32px;
		background-color: var(--grey-two);
		transition: transform 0.4s var(--bezier-one);
		user-select: none;
	}

	@media (max-width: 767px) {
		h5 {
			display: none;
		}

		img {
			height: 42px;
			width: 42px;
		}
		a {
			width: max-content;
			background-color: transparent;
			border: none;
		}
	}
</style>
