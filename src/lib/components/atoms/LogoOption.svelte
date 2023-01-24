<script lang="ts">
	import { onMount } from 'svelte';
	import Modal from './Dialogue.svelte';
	import Button from './Button.svelte';

	export let name = '';
	export let selected: Array<string>;
	export let variants;
	export let clicked = false;
	export let hideDetails = false;

	let hasVariants = variants.length > 1;
	let modalOpen = false;

	let i = 0;
	$: current = variants[i];
	let interval = null;
	onMount(() => {
		interval = setInterval(() => {
			if (i === variants.length - 1) {
				i = 0;
			} else {
				i += 1;
			}
		}, 2500);

		return () => clearInterval(interval);
	});

	function select_logo(id) {
		clicked = !clicked;
		if (selected.includes(id)) {
			selected = selected.filter((e) => e !== id);
		} else {
			selected.push(id);
			// the Updater
			selected = selected;
		}
		console.log(selected);
	}

	function nextVariant() {
		if (i >= variants.length) return null;
		console.log('next');
		i++;
	}

	function prevVariant() {
		if (i <= 0) return null;
		console.log('previous');
		i--;
	}

	function stopAutoScroll() {
		clearInterval(interval);
	}

	const handleClick = () => {
		if (!hasVariants) {
			select_logo(current.id);
		} else {
			modalOpen = !modalOpen;
			clearInterval(interval);
			i = 0;
		}
	};
</script>

{#if hasVariants}
	<Modal bind:modalOpen>
		<svelte:fragment slot="title">{name}</svelte:fragment>
		<div class="variants">
			{#each variants as variant}
				<!-- Mega Trolley -->
				<svelte:self
					bind:selected
					variants={[{ ...variant, filename: (i + 1).toString() }]}
					clicked={selected.includes(variant.id)}
					hideDetails={true}
				/>
			{/each}
		</div>
		<!-- <Variants /> -->
	</Modal>
{/if}

<!-- SHUT UP -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div class="option" tabindex="0" class:clicked>
	<div class="row" on:click={handleClick} on:keypress={handleClick}>
		<img src={current.gdrive_direct_url} alt={current.filename} />
		{#if !hideDetails}
			<div class="text">
				<h2>{name}</h2>
			</div>
		{/if}
	</div>
	{#if !hideDetails}
		<div class="actions">
			<Button
				on:click={prevVariant}
				on:click={stopAutoScroll}
				unclickable={i <= 0}
				icon="previous"
			/>
			<h4>{i + 1}/{variants.length}</h4>
			<Button
				on:click={nextVariant}
				on:click={stopAutoScroll}
				unclickable={i + 1 >= variants.length}
				icon="next"
			/>
		</div>
	{/if}
</div>

<style>
	.option {
		width: 100%;
		color: var(--white);
		transition: all 0.3s var(--bezier-one);
		border-radius: 16px;
		background-color: var(--grey-six);
		text-decoration: none;
	}

	.row {
		display: flex;
		align-items: center;
		padding: 1.25rem;
		gap: 1.5rem;
		cursor: pointer;
	}

	.actions {
		display: flex;
		flex-direction: row;
		padding: 0 1.25rem 1.25rem 1.25rem;
		align-items: center;
		justify-content: space-between;
	}

	.variants {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.5rem;
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

	.option:hover {
		filter: brightness(0.85);
	}

	img {
		border-radius: 8px;
		height: 125px;
		width: 125px;
		/* background-color: var(--grey-two); */
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

		.variants {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		}
	}
</style>
