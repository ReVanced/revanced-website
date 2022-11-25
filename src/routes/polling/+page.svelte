<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	
	import LogoOption from '$lib/components/atoms/LogoOption.svelte';
	import Button from '$lib/components/atoms/Button.svelte';

	let selected: Array<string> = [];
	let logos = [];
	let logoAmount = 4;
	let transitionDirection = 5;

	let currentPage = 0;
	let maxPages = 1;
	let min = 0;
	let max = logoAmount;

	// you will never see shittier code tm
	// will refactor later maybe idk
	onMount(async () => {
		const response = await fetch('https://poll.revanced.app/logos');
		const json = await response.json();
		currentPage = localStorage.getItem('currentPage');
		selected = JSON.parse(localStorage.getItem('selected'));

		min = currentPage * logoAmount;
		max = min + logoAmount;
		// guh
		for (const name of Object.keys(json)) {
			logos.push({ name, ...json[name] });
		}
		maxPages = Math.floor(logos.length / logoAmount);
		// update ui
		logos = logos;
	});

	function previousPage() {
		if (currentPage <= 0) return null;
		currentPage--;
		min = currentPage * logoAmount;
		max = min + logoAmount;
		localStorage.setItem('currentPage', currentPage.toString());
		transitionDirection = -5;
	}

	function nextPage() {
		if (currentPage + 1 >= maxPages) return null;
		currentPage++;
		min = currentPage * logoAmount;
		max = min + logoAmount;
		localStorage.setItem('currentPage', currentPage.toString());
		transitionDirection = 5;
	}
</script>

<svelte:head>
	<title>ReVanced · Logo Poll</title>
	<meta content="ReVanced · Logo Poll" name="og:title" />
	<meta content="ReVanced · Logo Poll" name="twitter:title" />
</svelte:head>

<main>
	<div class="wrapper">
		<div class="top-container">
			<h1>ReVanced Logo Poll</h1>
			<h2>{selected.length}/{logos.length} selected · Page {Number(currentPage) + 1}/{maxPages}</h2>
			<div class="top-custom-button-container">
				<a href="https://hhh.com" target="_blank" rel="noreferrer"><button>Help</button></a>
				<a href="https://revanced.app" target="_blank" rel="noreferrer"><button>Website</button></a>
			</div>
		</div>

		<div class="options-grid">
			{#each logos.slice(min, max) as { id, gdrive_direct_url, name, filename }}
				{#key currentPage}
					<span in:fly={{ x: transitionDirection, easing: expoOut, duration: 1000 }}>
						<LogoOption
							bind:selected
							clicked={selected.includes(id)}
							{id}
							logo={gdrive_direct_url}
							{name}
							{filename}
						/>
					</span>
				{/key}
			{/each}
		</div>

		<div class="buttons-container">
			<Button on:click={previousPage} unclickable={currentPage <= 0}>Previous</Button>
			<Button kind="primary" on:click={nextPage} unclickable={currentPage + 1 >= maxPages}
				>Next</Button
			>
		</div>
	</div>
</main>

<style>
	.options-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 3rem;
	}

	h1 {
		font-size: 2rem;
		font-weight: 600;
		text-align: center;
		color: var(--grey-four);
	}

	h2 {
		font-size: 1rem;
		color: var(--grey-three);
		text-align: center;
	}

	.buttons-container {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		justify-content: right;
		float: bottom;
	}

	button {
		background-color: transparent;
		border: none;
		border: 1px solid var(--grey-six);
		color: var(--grey-four);
		padding: 0.5rem 1.25rem;
		border-radius: 12px;
		cursor: pointer;
	}

	.top-container {
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 2rem;
		background-color: var(--accent-color);
		padding: 2rem;
		border-radius: 12px;
	}

	.top-custom-button-container {
		margin-top: 0.5rem;
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
	}
	@media screen and (max-width: 768px) {
		h1 {
			font-size: 1.75rem;
		}

		.options-grid {
			grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
		}
	}
</style>
