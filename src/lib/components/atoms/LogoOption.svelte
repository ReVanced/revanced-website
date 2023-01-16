<script lang="ts">
  import Modal from './Dialogue.svelte';
  import Variants from './Variants.svelte';
	export let name: string;
	export let selected: Array<string>;
  export let variants;
	export let clicked = false;

  let has_variants = variants.length > 1;
  let modalOpen = false;

  // TODO: cycle between them.
  let current = variants[0];

  function select_logo(id) {
		// clicked = !clicked;
		if (selected.includes(id)) {
			selected = selected.filter((e) => e !== id);
		} else {
			selected.push(id);
			// the Updater
			selected = selected;
		}
		console.log(selected);
  }

	const handleClick = () => {
    if (!has_variants) {
      select_logo(current.id);
    } else {
      modalOpen = !modalOpen;
    }
	};
</script>


<Modal bind:modalOpen>
	<svelte:fragment slot="title">{name}</svelte:fragment>
	<svelte:fragment slot="description">
    guhhhhhhhhhhhhhhhhhhhhh
	</svelte:fragment>
  <Variants />
</Modal>

<!-- SHUT UP -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div class="option" on:click={handleClick} on:keypress={handleClick} tabindex="0" class:clicked>
	<img src={current.gdrive_direct_url} alt={current.filename} />
	<div class="text">
		<h2>{name}</h2>
		<h6>{current.filename}</h6>
    {#if has_variants}
      <h4>This logo has variants</h4>
    {/if}
	</div>
</div>

<style>

	.option {
		color: var(--white);
		text-decoration: none;
		padding: 1.25rem;
		width: 100%;
		transition: all 0.3s var(--bezier-one);
		border-radius: 16px;
		display: flex;
		gap: 1.5rem;
		background-color: var(--grey-six);
		cursor: pointer;
		align-items: center;
	}

	h2 {
		font-size: 1rem;
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
	}

  h4 {
    font-weight: 800;
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
		color: var(--white);
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
