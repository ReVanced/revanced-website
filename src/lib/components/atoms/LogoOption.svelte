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
	};
</script>

<!-- SHUT UP -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div class="option" on:click={handleClick} on:keypress={handleClick} tabindex="0" class:clicked>
	<img src={logo} alt={filename} />
	<div class="text">
		<h2>{name}</h2>
		<h6>{filename}</h6>
	</div>
</div>

<style>

	.option {
		color: var(--white);
		text-decoration: none;
		padding: 1.25rem;
		width: 100%;
		transition: all 0.3s var(--bezier-one);
		border-radius: 12px;
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
		overflow: hidden;
		text-overflow: ellipsis;
	}

	h6 {
		font-size: 0.9rem;
		overflow: hidden;
		text-overflow: ellipsis;

	}
	.text {
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
	}

	.clicked {
		background-color: var(--accent-low-opacity);
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
		height: 125px;
		width: 125px;
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
