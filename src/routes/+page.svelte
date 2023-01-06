<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';

	import LogoOption from '$lib/components/atoms/LogoOption.svelte';
	import Button from '$lib/components/atoms/Button.svelte';

	let selected: Array<string> = [];
	let logos: Array<any> = [];
	let transitionDirection = 5;
	let logoAmount = 4;
	let currentPage = 0;
	let logoPages = 1;
	let min = 0;
	let max = logoAmount;
  let token: string = "";

// try {
// 		currentPage = Number(localStorage.getItem('currentPage')) || 0;
// 		selected = JSON.parse(localStorage.getItem('selected')) || [];
// 	} catch (err) {
// 		console.log(err);
// 	}

	// you will never see shittier code tm
	// will refactor later maybe idk
	onMount(async () => {
		const response = await fetch('https://poll.revanced.app/logos');
		const json = await response.json();

		// make better json
		for (const name of Object.keys(json)) {
			logos.push({ name, ...json[name] });
		}

		// randomize the order of the logos to minimize bias
		for (let i = logos.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * i);
			let k = logos[i];
			logos[i] = logos[j];
			logos[j] = k;
		}

		// min is the lowest index of the logos on a page, max is the highest index
		// max will be determined based on min and the amount of logos we want on each page (4)
		min = currentPage * logoAmount;
		max = min + logoAmount;

		logoPages = Math.floor(logos.length / logoAmount);
		// update ui
		logos = logos;

    if (location.hash !== "") {
      const response = await fetch('https://poll.revanced.app/auth/exchange', {
        method: "POST",
        headers: {
          "Authorization": location.hash
        }
      });

      const json = await response.json();

      token = json.access_token;
      console.log("super h: " + token);
    } else {
      alert("Warning: No token!");
    }
	});

	function previousPage() {
		if (currentPage <= 0) return null;
		currentPage--;
		localStorage.setItem('currentPage', currentPage.toString());

		min = currentPage * logoAmount;
		max = min + logoAmount;
		transitionDirection = -5;
	}

	function nextPage() {
		if (currentPage >= logoPages) return null;
		currentPage++;
		localStorage.setItem('currentPage', currentPage.toString());

		min = currentPage * logoAmount;
		max = min + logoAmount;
		transitionDirection = 5;
	}

	function clearLogos() {
		selected = [];
		localStorage.setItem('selected', JSON.stringify(selected));
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
			<h3>ReVanced</h3>
			<h1>{currentPage >= logoPages ? 'Review selected logos' : 'Select logos'}</h1>
			<h2>
				{selected.length}/{logos.length} selected · Page {Number(currentPage) + 1}/{logoPages + 1}
			</h2>
			<div class="top-custom-button-container">
				<a href="https://hhh.com" target="_blank" tabindex="-1" rel="noreferrer">
					<button>How does this work?</button>
				</a>
				<button on:click={clearLogos}>Clear All</button>
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

			{#if currentPage >= logoPages}
				{#each logos as { id, gdrive_direct_url, name, filename }}
					{#if selected.includes(id)}
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
					{/if}
				{/each}
			{/if}
		</div>

		{#if currentPage >= logoPages && !selected.length}
			<div class="warning" in:fly={{ x: transitionDirection, easing: expoOut, duration: 1000 }}>
				<h6>No logos have been selected.</h6>
			</div>
		{/if}
	</div>
	<div class="buttons-container">
		<Button on:click={previousPage} unclickable={currentPage <= 0}>
			Previous
		</Button>
		<Button kind="primary" on:click={nextPage} unclickable={currentPage >= logoPages}>
			{currentPage >= logoPages ? 'Submit' : 'Next'}
		</Button>
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
		font-size: 1.25rem;
		color: var(--grey-three);
		text-align: center;
	}

	h3 {
		font-weight: 500;
		color: var(--grey-three);
		margin-bottom: -0.5rem;
	}

	.buttons-container {
		display: flex;
		gap: 1rem;
		justify-content: right;
		width: 100%;
		z-index: 999;
		position: fixed;
		bottom: 0;
		right: 0;
		background-color: var(--grey-six);
		padding: 1rem 1.5rem;
		border-top: 1px solid var(--grey-three);
	}

	button {
		background-color: transparent;
		border: none;
		border: 1px solid var(--grey-six);
		color: var(--grey-four);
		padding: 0.5rem 1.25rem;
		border-radius: 12px;
		cursor: pointer;
		font-weight: 500;
	}

	.top-container {
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 2rem;
		background-color: var(--accent-color);
		padding: 1.75rem;
		border-radius: 12px;
	}

	.top-custom-button-container {
		margin-top: 0.5rem;
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
	}

	.warning {
		display: flex;
		justify-content: center;
	}

	@media screen and (max-width: 768px) {
		h1 {
			font-size: 1.75rem;
		}
		.options-grid {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		}
	}
</style>
