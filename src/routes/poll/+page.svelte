<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import type { Logo, LogoAPIResponse } from '$lib/types';

	import Modal from '$lib/components/atoms/Dialogue.svelte';
	import LogoOption from '$lib/components/atoms/LogoOption.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import { goto } from '$app/navigation';

	import questionMark from '$lib/assets/icons/help.svg';
	import trash from '$lib/assets/icons/delete.svg';

	interface Selected {
		[key: string]: string[];
	}

	let modalOpen = false;
	let selected: Selected = {};
	function calc_ui_selected_count(v: Selected) {
		let n = 0;
		for (const item of Object.values(v)) {
			if (item.length != 0) {
				console.log(item);
				n += 1;
			}
		}
		return n;
	}

	// afn please don't do this lol this is shitty code
	$: ui_selected_count = calc_ui_selected_count(selected);
	let logos: Logo[] = [];
	let logo_ids: string[] = [];
	let transitionDirection = 5;
	let logoAmount = 4;
	let currentPage = 0;
	let logoPages = 1;
	let min = 0;
	let max = logoAmount;
	let token = '';
	let submit = false;
	let allowReviewSelections = false;
	$: finalPage = false;
	$: min = currentPage * logoAmount;
	$: max = min + logoAmount;

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
		const json: LogoAPIResponse = await response.json();

		for (const name of Object.keys(json)) {
			// lol the performance
			selected[name] = [];

			logos.push({ name, variants: json[name].logos });
			logo_ids = [...logo_ids, ...json[name].logos.map((v) => v.id)];
		}
		console.log(logos);
		console.log(logo_ids);

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
		} else if (localStorage.getItem('killswitch') === null) {
			await goto('/poll/unauthorized/');
		} else {
			alert('Warning: no token!');
		}
	});

	function previousPage() {
		if (currentPage <= 0) {
			if (allowReviewSelections) {
				// If the current page is 0 and the user has reached the final page beforehand, go to the final page
				currentPage = logoPages - 1;
			} else {
				// If the current page is 0 and the user has not reached the final page beforehand, return
				return;
			}
		} else {
			// If the current page is not 0, go to the previous page
			currentPage--;
		}
		submit = false;
		transitionDirection = -5;
	}

	function preloadImage(url: string) {
		var img = new Image();
		img.src = url;
	}

	function nextPage() {
		let nextPage = currentPage + 1;

		// If the current page is the last page, set the current page to the first page
		if (currentPage >= logoPages - 1) {
			currentPage = 0;
		} else {
			currentPage++;

			// If the current page is now the last page, allow review selections and set the current page to the first page
			if (currentPage >= logoPages - 1) {
				allowReviewSelections = true;
				nextPage = 0;
			}
		}

		const nextMin = nextPage * logoAmount;
		const nextMax = nextMin + logoAmount;

		logos.slice(nextMin, nextMax).forEach(({ variants }) => {
			variants.forEach((variant) => preloadImage(variant.gdrive_direct_url));
		});
		transitionDirection = 5;
	}

	function stopReview() {
		finalPage = false;
		submit = false;
	}

	function reviewSelections() {
		if (allowReviewSelections) {
			finalPage = true;
		}
	}

	function submitSelection() {
		if (ui_selected_count < 1) return null;
		submit = true;
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
		const selected_ids = [...Object.values(selected)].flat();
		console.log('selected ids', selected_ids);
		const data = {
			votes: logo_ids.map((id) => ({ cid: id, vote: selected_ids.includes(id) }))
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
			<div class="top-container-text">
				<h3>ReVanced</h3>
				<h1>{finalPage ? 'Review selected logos' : 'Select logos'}</h1>
				<h2>
					{ui_selected_count}/{logos.length} selected · Page {currentPage + 1}/{logoPages}
				</h2>
			</div>
			<div class="top-custom-button-container">
				<Button on:click={() => (modalOpen = !modalOpen)} kind="icon" icon={questionMark}></Button>
				<Button on:click={clearLogos} kind="icon" icon={trash}></Button>
			</div>
		</div>

		<div class="options-grid">
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
			{:else}
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
			{/if}
		</div>

		{#if finalPage && ui_selected_count < 1}
			<div class="warning" in:fly={{ x: transitionDirection, easing: expoOut, duration: 1000 }}>
				<h6>No logos selected.</h6>
			</div>
		{/if}

		{#if submit}
			<Modal modalOpen={true}>
				<svelte:fragment slot="title">Submit</svelte:fragment>
				<div style="text-align: center;">
					{#await submitBallot()}
						<h6 in:fly={{ x: transitionDirection, easing: expoOut, duration: 1000 }}>
							Submitting your vote...
						</h6>
					{:then _}
						<h6 in:fly={{ x: transitionDirection, easing: expoOut, duration: 1000 }}>
							Your vote has been casted.
						</h6>
					{:catch err}
						<h6 in:fly={{ x: transitionDirection, easing: expoOut, duration: 1000 }}>
							An error occured. Try again later.
							<br />
							{err}
						</h6>
					{/await}
				</div>
			</Modal>
		{/if}
	</div>
	<div class="buttons-container">
		{#if !finalPage}
			<Button on:click={previousPage} unclickable={currentPage <= 0 && !allowReviewSelections}
				>Previous</Button
			>
		{/if}
		<Button
			on:click={finalPage ? stopReview : reviewSelections}
			unclickable={!allowReviewSelections}
		>
			{finalPage ? 'Go back' : 'Preview selection'}</Button
		>
		<Button
			kind="primary"
			on:click={finalPage ? submitSelection : nextPage}
			unclickable={submit || (finalPage && ui_selected_count < 1)}
		>
			{finalPage ? 'Submit' : 'Next'}
		</Button>
	</div>
</main>

<Modal bind:modalOpen>
	<svelte:fragment slot="title">How does this work?</svelte:fragment>
	<svelte:fragment slot="description">
		<div class="desc">
			<h6>
				This is an approval voting system. Voters can choose any number of logo and variants. The
				logo that is selected the most wins. Note that you can only vote once!
			</h6>
		</div>
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

	/* "How does this work?" Modal */
	h6 {
		color: var(--white);
		margin-bottom: 0.5rem;
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
		margin-bottom: 2rem;
		background-color: var(--accent-color);
		padding: 2rem;
		border-radius: 20px;
		display: flex;
		justify-content: space-between;
	}

	.top-container-text{
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.top-custom-button-container {
		margin-top: 0.5rem;
		display: flex;
		flex-direction: row;
		gap: 0.75rem;
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
			grid-template-columns: repeat(auto-fill, minmax(16.628645896rem, 1fr));
		}

		.desc {
			min-width: min(20rem, 90vw);
		}
	}
</style>
