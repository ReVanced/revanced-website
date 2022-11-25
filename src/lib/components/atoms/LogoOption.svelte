<script lang="ts">
	export let name: string;
	export let logo: string;
	export let filename: string;
	export let id: string;
	export let selected: Array<string>;
	export let clicked = false;

	const handleClick = () => {
		clicked = !clicked;

		if (selected.includes(id)) {
			selected = selected.filter((e) => e !== id);
		} else {
			selected.push(id);
			// the Updater
			selected = selected;
		}
		console.log(selected);
		localStorage.setItem("selected", JSON.stringify(selected));
	};
</script>

<div on:click={handleClick} class:clicked>
	<img src={logo} alt={filename} />
	<span class="text">
		<h2>{name}</h2>
		<h6>{filename}</h6>
	</span>
</div>

<style>
	div {
		color: var(--white);
		text-decoration: none;
		padding: 1.5rem;
		width: 100%;
		transition: all 0.3s var(--bezier-one);
		border-radius: 8px;
		display: flex;
		gap: 1.5rem;
		background-color: var(--grey-six);
		border: 1px solid var(--grey-three);
		cursor: pointer;
		align-items: center;
	}


	h2 {
		font-size: 1rem;
		font-weight: 500;
		
	}

	h6 {
		font-size: 0.9rem;
	}

	h2, h6 {
		display: block;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.text {
		flex-direction: column;
	}

	.clicked {
		background-color: var(--grey-three);
	}

	.clicked h2,
	.clicked h6 {
		color: var(--accent-color);
	}

	div:hover {
		filter: brightness(0.85);
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
		div {
			flex-direction: column;
		}

		.text {
			text-align: center;
		}
	}
</style>
