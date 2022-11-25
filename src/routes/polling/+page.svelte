<script lang="ts">
	import LogoOption from '$lib/components/atoms/LogoOption.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import { onMount } from 'svelte';

	let selected: Array<string> = [];
	let logos = [];
	let currentPage = 1;
	let maxPages = 1;
	let logoAmount = 4;
	let min = 0;
	let max = logoAmount;

	onMount(async () => {
		const response = await fetch('https://poll.revanced.app/logos');
		const json = await response.json();
		// guh
		for (const name of Object.keys(json)) {
			logos.push({ name, ...json[name] });
		}
		// update ui
		logos = logos;
		maxPages = Math.floor(logos.length / logoAmount);
	});

	function previousPage() {
		min -= logoAmount;
		max -= logoAmount;
		currentPage--;
	}

	function nextPage() {
		min += logoAmount;
		max += logoAmount;
		currentPage++;
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
			<h2>{selected.length}/4 selected· Page {currentPage}/{maxPages}</h2>
			<div class="top-custom-button-container">
				<a href="https://hhh.com" target="_blank" rel="noreferrer"><button>Help</button></a>
				<a href="https://revanced.app" target="_blank" rel="noreferrer"><button>Website</button></a>
			</div>
		</div>
		<div class="options-grid">
			{#each logos.slice(min, max) as { id, gdrive_direct_url, name, filename }}
				{#key currentPage}
					<LogoOption bind:selected clicked={selected.includes(id)} {id} logo={gdrive_direct_url} {name} {filename} />
				{/key}
			{/each}
		</div>

		<div class="buttons-container">
			<Button on:click={previousPage} unclickable={currentPage <= 1}>Previous</Button>
			<Button kind="primary" on:click={nextPage} unclickable={currentPage >= maxPages}>Next</Button>
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
			font-size: 1.5rem;
		}

		.options-grid {
			grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
		}
	}
</style>
