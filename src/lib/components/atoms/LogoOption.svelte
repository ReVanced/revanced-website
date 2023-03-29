<script lang="ts">
	import { onMount } from 'svelte';
	import Modal from './Dialogue.svelte';
	import Button from './Button.svelte';

	import next from '$lib/assets/icons/next.svg';
	import previous from '$lib/assets/icons/previous.svg';
	import type { Logo } from '$lib/types';

	export let selected: string[];
	export let variants: Logo[];
	export let clicked = false;
	export let hideDetails = false;

	let hasVariants = variants.length > 1;
	let modalOpen = false;

	let i = 0;
	$: current = variants[i];
	let interval = 0;
	onMount(() => {
		if (!hasVariants) {
			return;
		}
	});

	function select_logo(id: string) {
		clicked = !clicked;
		if (selected.includes(id)) {
			selected = selected.filter((e) => e !== id);
		} else {
			selected.push(id);
			// the Updater
			selected = selected;
		}
	}

	function nextVariant() {
		if (i >= variants.length - 1) {
			return;
		}
		i++;
	}

	function prevVariant() {
		if (i == 0) {
			return;
		}
		i--;
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
		<svelte:fragment slot="title">Select logo variants</svelte:fragment>
		<div class="variants">
			{#each variants as variant}
				<!-- Mega Trolley -->
				<svelte:self
					bind:selected
					class="variant"
					variants={[variant]}
					clicked={selected.includes(variant.id)}
					hideDetails={true}
				/>
			{/each}
		</div>
		<!-- <Variants /> -->
		<div class="buttons">
			<Button
				kind="text"
				on:click={() => {
					modalOpen = false;
				}}>Close</Button
			>
		</div>
	</Modal>
{/if}

<!-- SHUT UP -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div class="option" on:click={handleClick} on:keypress={handleClick} tabindex="0" class:clicked>
	<div class="row">
		<!-- Screenreader compatibility does not make sense in this context. -->
		<img src={current.optimized_direct_url ?? current.logo_direct_url} alt="" />
	</div>
	{#if !hideDetails}
		<div class="actions">
			<h3>{i + 1}/{variants.length}</h3>
			<div class="action-buttons">
				<Button
					on:click={prevVariant}
					disabled={i <= 0}
					icon={previous}
					alt="previous"
					kind="circle"
				/>
				<Button
					on:click={nextVariant}
					disabled={i + 1 >= variants.length}
					icon={next}
					alt="next"
					kind="circle"
				/>
			</div>
		</div>
	{/if}
</div>

<style>
	.option {
		border: 1.5px solid var(--grey-three);
		width: 100%;
		color: var(--white);
		transition: all 0.3s var(--bezier-one);
		border-radius: 16px;
		background-color: var(--grey-six);
		text-decoration: none;
		cursor: pointer;
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.25rem;
		gap: 1.5rem;
		cursor: pointer;
	}

	.actions {
		border-top: 1px solid var(--grey-three);
		display: flex;
		flex-direction: row;
		padding: 1rem 1.25rem;
		align-items: center;
		border-radius: 0 0 16px 16px;
		justify-content: space-between;
		pointer-events: none;
	}

	.action-buttons {
		display: flex;
		gap: 1rem;
		pointer-events: all;
		width: max-content;
	}

	.variants {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.5rem;
	}

	@media screen and (max-width: 768px) {
		.variants {
			grid-template-columns: repeat(1, minmax(0, 1fr));
		}
	}

	.clicked {
		background-color: var(--accent-low-opacity);
	}
	.option:hover {
		filter: brightness(0.85);
	}

	img {
		border-radius: 8px;
		height: 125px;
		max-width: 125px;
		transition: transform 0.4s var(--bezier-one);
		user-select: none;
	}

	.buttons {
		display: flex;
		justify-content: flex-end;
		gap: 1.5rem;
		margin-top: 16px;
	}


</style>
