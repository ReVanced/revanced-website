<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';

	import Modal from '$lib/components/atoms/Dialogue.svelte';
	import LogoOption from '$lib/components/atoms/LogoOption.svelte';
	import Button from '$lib/components/atoms/Button.svelte';

	let modalOpen = false;
	let selected = {};
	function calc_ui_selected_count(v) {
		let n = 0;
		for (const item of Object.values(v)) {
			if (item.length != 0) {
				console.log(item);
				n += 1;
			}
		}
		return n;
	}
	function calc_selected_logo_ids(v) {
		return [...Object.values(v)].map((data) => data.variants).flat();
	}

	// afn please don't do this lol this is shitty code
	$: ui_selected_count = calc_ui_selected_count(selected);
	$: selected_logo_ids = calc_selected_logo_ids(selected);
	let logos = [];
	let logo_ids = [];
	let transitionDirection = 5;
	let logoAmount = 4;
	let currentPage = 0;
	let logoPages = 1;
	let min = 0;
	let max = logoAmount;
	let token: string = '';
	let submit = false;
	$: finalPage = currentPage >= logoPages;

	async function exchange_token(bot_token: string) {
		const response = await fetch('https://poll.revanced.app/auth/exchange', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${bot_token}`
			}
		});

		if (!response.ok) {
			throw Error(`Status Code ${response.status}: ${await response.text()}`);
		}

		const json = await response.json();

		token = json.access_token;
	}

	// you will never see shittier code tm
	// will refactor later maybe idk
	// Reply: don't think we need to refactor because nobody cares if this code is shit lol
	onMount(async () => {
		window['use_token'] = exchange_token;
		window['submit_poll'] = submitBallot;

		const response = await fetch('https://poll.revanced.app/logos');
		const json = await response.json();

		for (const name of Object.keys(json)) {
			// lol the performance
			selected[name] = [];

			logos.push({ name, variants: json[name].logos });
			logo_ids = [...logo_ids, ...json[name].logos.map((v) => v.id)];
		}
		console.log(logos);
		console.log(logo_ids);
		console.log(selected_logo_ids);

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

		if (location.hash !== '') {
			try {
				await exchange_token(location.hash.substring(1));
			} catch (err) {
				alert(`Could not exchange the token: ${err}`);
			}
		} else {
			alert('Warning: No token!');
		}
	});

	function previousPage() {
		if (currentPage <= 0) return null;
		currentPage--;
		submit = false;

		min = currentPage * logoAmount;
		max = min + logoAmount;
		transitionDirection = -5;
	}

function preloadImage(url: string) {
  var img=new Image();
  img.src=url;
}

	function nextPage() {
		if (currentPage >= logoPages || submit) return null;
		currentPage++;

		min = currentPage * logoAmount;
		max = min + logoAmount;

    if (currentPage < logoPages) {
      const nextPage = currentPage + 1;
      const nextMin = nextPage * logoAmount;
      const nextMax = nextMin + logoAmount;
      logos.slice(nextMin, nextMax).forEach(({ variants }) => {
        variants.forEach(variant => preloadImage(variant.gdrive_direct_url));
      });
    }
		transitionDirection = 5;
	}

	function clearLogos() {
		if (submit) {
			return;
		}

		logos.forEach((v) => {
			selected[v.name] = [];
		});
	}

	async function submitBallot() {
		const data = {
			votes: logo_ids.map((id) => ({ cid: id, vote: selected_logo_ids.includes(id) }))
		};
		console.log(data);

		const response = await fetch('https://poll.revanced.app/ballot', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		if (!response.ok) {
			throw Error(`Status Code ${response.status}: ${await response.text()}`);
		}
		const json = await response.json();

		if (!json.cast) {
			throw Error('Vote not cast.');
		}
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
			<h1>{finalPage ? 'Review selected logos' : 'Select logos'}</h1>
			<h2>
				{ui_selected_count}/{logos.length} selected · Page {Number(currentPage) + 1}/{logoPages + 1}
			</h2>
			<div class="top-custom-button-container">
				<button on:click={() => (modalOpen = !modalOpen)}>How does this work?</button>
				<button on:click={clearLogos}>Clear All</button>
			</div>
		</div>

		<div class="options-grid">
			{#each logos.slice(min, max) as { variants, name }}
				{#key currentPage}
					<span in:fly={{ x: transitionDirection, easing: expoOut, duration: 1000 }}>
						<LogoOption
							bind:selected={selected[name]}
							clicked={selected[name].length != 0}
							{variants}
							{name}
						/>
					</span>
				{/key}
			{/each}

			{#if finalPage}
				{#each logos as { variants, name }}
					{#if selected[name].length != 0}
						<span in:fly={{ x: transitionDirection, easing: expoOut, duration: 1000 }}>
							<LogoOption
								bind:selected={selected[name]}
								clicked={selected[name].length != 0}
								{variants}
								{name}
							/>
						</span>
					{/if}
				{/each}
			{/if}
		</div>

		{#if finalPage && !selected_logo_ids.length}
			<div class="warning" in:fly={{ x: transitionDirection, easing: expoOut, duration: 1000 }}>
				<h6>No logos have been selected.</h6>
			</div>
		{/if}

		{#if submit}
			<div style="text-align: center;">
				{#await submitBallot()}
					<h6 in:fly={{ x: transitionDirection, easing: expoOut, duration: 1000 }}>
						Submitting...
					</h6>
				{:then _}
					<h6 in:fly={{ x: transitionDirection, easing: expoOut, duration: 1000 }}>
						Your vote has been cast.
					</h6>
				{:catch err}
					<h6 in:fly={{ x: transitionDirection, easing: expoOut, duration: 1000 }}>
						An error occured. Try again later.
						<br />
						{err}
					</h6>
				{/await}
			</div>
		{/if}
	</div>
	<div class="buttons-container">
		<Button on:click={previousPage} unclickable={currentPage <= 0}>Previous</Button>
		<Button
			kind="primary"
			on:click={finalPage ? () => (submit = true) : nextPage}
			unclickable={submit}
		>
			{finalPage ? 'Submit' : 'Next'}
		</Button>
	</div>
</main>

<Modal bind:modalOpen>
	<svelte:fragment slot="title">How does this work?</svelte:fragment>
	<svelte:fragment slot="description">
		<h6>
			This is an approval voting system. Voters can choose any number of logos. The logo that is
			selected the most wins. Note that you can only vote once!
		</h6>
	</svelte:fragment>
	<div class="buttons">
		<Button
			on:click={() => {
				modalOpen = false;
			}}>Understood</Button
		>
	</div>
</Modal>

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
		color: var(--white);
	}

	h2 {
		font-size: 1.25rem;
		color: var(--white);
	}

	h3 {
		color: var(--white);
		margin-bottom: -0.5rem;
	}

	h6 {
		color: var(--white);
		margin-bottom: 0.5rem;
	}

	b {
		color: var(--white);
		margin-bottom: 1rem;
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

	.information {
		text-align: center;
		margin-bottom: 1rem;
	}

	.buttons {
		display: flex;
		justify-content: flex-end;
	}

	@media screen and (orientation: landscape) and (min-width: 1500px) and (min-height: 950px) {
		.buttons-container {
			justify-content: center;
			z-index: unset;
			position: unset;
			bottom: unset;
			right: unset;
			border-top: none;
			background-color: transparent;
		}

		:global(.wrapper) {
			padding-bottom: 0;
		}
	}

	button {
		background-color: transparent;
		border: none;
		border: 1px solid #9e8c90;
		color: #ece0e1;
		padding: 0.5rem 1.25rem;
		border-radius: 8px;
		cursor: pointer;
		font-weight: 500;
	}

	.top-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 2rem;
		background-color: var(--accent-color);
		padding: 2rem;
		border-radius: 20px;
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
			/* The magic number, teef */
			grid-template-columns: repeat(auto-fill, minmax(16.628645896rem, 1fr))
		}
	}
</style>
