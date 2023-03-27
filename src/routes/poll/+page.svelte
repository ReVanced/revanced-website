<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import type { Logo, LogosResponse } from '$lib/types';
	import Modal from '$lib/components/atoms/Dialogue.svelte';
	import LogoOption from '$lib/components/atoms/LogoOption.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import { goto } from '$app/navigation';
	import { dev } from '$app/environment';

	import questionMark from '$lib/assets/icons/help.svg';
	import trash from '$lib/assets/icons/delete.svg';

	let selected: string[][] = [];

	let helpModal = true;
	let clearModal = false;
	let submitModal = false;

	// afn please don't do this lol this is shitty code
	$: ui_selected_count = selected.filter((x) => x.length > 0).length;
	let logos: LogosResponse = [];
	let logo_ids: string[] = [];
	let transitionDirection = 5;
	let logoAmount = 4;
	let currentPage = 0;
	let logoPages = 1;
	let min = 0;
	let max = logoAmount;
	let token = '';
	let submit = false;
	let submitted = false;
	let erred = false;
	let botToken: string;
	$: finalPage = currentPage >= logoPages;
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
			if (response.status === 401 || response.status === 422) {
				goto('/poll/token-expired/');
			}
			throw Error(`Status Code ${response.status}: ${await response.text()}`);
		}

		const json = await response.json();

		token = json.access_token;
	}

	// you will never see shittier code tm
	// will refactor later maybe idk
	// Reply: don't think we need to refactor because nobody cares if this code is shit lol
	onMount(async () => {
		setTimeout(async () => {
			await goto('/poll/token-expired/');
			localStorage.setItem('expired-token', botToken);
		}, 600000);

		window.use_token = exchange_token;
		window.submit_poll = submitBallot;

		const response = await fetch('https://poll.revanced.app/logos');
		logos = await response.json();

		selected = logos.map((_) => []);
		logos.flatMap((x) => x).forEach((variants) => logo_ids.push(variants.id));

		// randomize the order of the logos to minimize bias
		for (let i = logos.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * i);
			let k = logos[i];
			logos[i] = logos[j];
			logos[j] = k;
		}
		
		let content = ''
		logos.forEach((variants) => {
			variants.forEach((variant) =>
				content += `url(${variant.optimized_direct_url ?? variant.logo_direct_url}) `
			);
		});
		
		// can't use inline styles with ::after so here's this hack for a hack
		let style = `
			.wrapper::after {
				position: absolute; 
				width: 0; 
				height: 0; 
				overflow: hidden; 
				z-index: -1;
				content: ${content}; 
			}

		`

		let styleSheet = document.createElement("style")
		styleSheet.innerText = style
		document.head.appendChild(styleSheet)

		// min is the lowest index of the logos on a page, max is the highest index
		// max will be determined based on min and the amount of logos we want on each page (4)
		min = currentPage * logoAmount;
		max = min + logoAmount;

		logoPages = Math.ceil(logos.length / logoAmount);
		// update ui
		logos = logos;

		if (location.hash !== '') {
			botToken = location.hash.substring(1);
			try {
				await exchange_token(location.hash.substring(1));
			} catch (err) {
				console.log(`Could not exchange the token: ${err}`);
			}
		} else if (!dev) {
			await goto('/poll/unauthorized/');
		} else {
			alert('Warning: no token!');
		}

		if (localStorage.getItem('expired-token') === botToken) {
			await goto('/poll/token-expired/');
		}
	});

	function previousPage() {
		if (currentPage <= 0) return null;
		currentPage--;
		submit = false;
		transitionDirection = -5;
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	}

	function nextPage() {
		if (currentPage >= logoPages || submit) return null;
		currentPage++;
		transitionDirection = 5;
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	}

	function submitSelection() {
		if (ui_selected_count < 1) return null;
		submitModal = true;
	}

	function clearLogos() {
		if (submit) {
			return;
		}

		for (let i = 0; i < logos.length; i++) {
			selected[i] = [];
		}
	}

	async function submitBallot() {
		const selected_ids = [...Object.values(selected)].flat();
		const data = {
			votes: logo_ids.map((id) => ({ cid: id, vote: selected_ids.includes(id) }))
		};

		const response = await fetch('https://poll.revanced.app/ballot', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		if (response.ok) submitted = true;
		else {
			erred = true;
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
					{ui_selected_count}/{logos.length} selected · Page {currentPage + 1}/{logoPages + 1}
				</h2>
			</div>
			<div class="top-custom-button-container">
				<Button on:click={() => (helpModal = !helpModal)} kind="icon" icon={questionMark} />
				<Button on:click={() => (clearModal = !clearModal)} kind="icon" icon={trash} />
			</div>
		</div>

		<div class="options-grid">
			{#if finalPage}
				{#each logos as logo_set, i}
					{#if selected[i].length != 0}
						<span in:fly={{ x: transitionDirection, easing: expoOut, duration: 1000 }}>
							<LogoOption
								bind:selected={selected[i]}
								clicked={selected[i].length != 0}
								variants={logo_set}
							/>
						</span>
					{/if}
				{/each}
			{:else}
				{#each logos.slice(min, max) as logo_set, i}
					{#key currentPage}
						<span in:fly={{ x: transitionDirection, easing: expoOut, duration: 1000 }}>
							<LogoOption
								bind:selected={selected[min + i]}
								clicked={selected[min + i].length != 0}
								variants={logo_set}
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

		<Modal bind:modalOpen={submitModal}>
			<svelte:fragment slot="title">
				{#if submit}
					Submitting
				{:else if submitted}
					Vote casted
				{:else}
					Confirm submission
				{/if}
			</svelte:fragment>
			<svelte:fragment slot="description">
				{#if submit}
					<div>
						{#await submitBallot()}
							<h6>Submitting your vote...</h6>
						{:then _}
							<h6>
								Thank you, your vote has been casted. You will not be able to vote again. You may
								now close this tab.
							</h6>
						{:catch err}
							<h6>
								An error occurred. Try again later.
								<br />
								{err}
							</h6>
						{/await}
					</div>
				{:else}
					<div>
						<h6>Do you want to cast your vote? You will not be able to vote again.</h6>
					</div>
				{/if}
			</svelte:fragment>

			<div class="buttons">
				<Button
					kind="text"
					on:click={() => {
						submitModal = false;
					}}>{submitted || erred ? 'Close' : 'Cancel'}</Button
				>
				{#if !erred}
					{#if !submitted}
						<Button
							kind="text"
							on:click={() => {
								submit = true;
							}}>Submit</Button
						>
					{/if}
				{/if}
			</div>
		</Modal>
	</div>
	<div class="buttons-container">
		<Button on:click={previousPage} unclickable={currentPage <= 0 || submitted}>Previous</Button>
		<Button
			kind="primary"
			on:click={finalPage ? submitSelection : nextPage}
			unclickable={(finalPage && ui_selected_count < 1) || submitted}
		>
			{finalPage ? 'Submit' : 'Next'}
		</Button>
	</div>
</main>

<Modal bind:modalOpen={helpModal}>
	<svelte:fragment slot="title">How does this work?</svelte:fragment>
	<svelte:fragment slot="description">
		<div class="desc">
			<h6>
				This is an approval voting system. Voters can choose any number of logos (and its variants
				if applicable). The logo that is selected the most wins. Note that you can only vote once.
			</h6>
		</div>
	</svelte:fragment>
	<div class="buttons">
		<Button
			kind="text"
			on:click={() => {
				helpModal = false;
			}}>OK</Button
		>
	</div>
</Modal>

<Modal bind:modalOpen={clearModal}>
	<svelte:fragment slot="description">
		<div class="desc">
			<h6>Reset selection?</h6>
		</div>
	</svelte:fragment>
	<div class="buttons">
		<Button
			kind="text"
			on:click={() => {
				clearModal = false;
			}}>Cancel</Button
		>
		<Button
			kind="text"
			on:click={() => {
				clearModal = false;
				clearLogos();
			}}>OK</Button
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

	.buttons-container {
		display: flex;
		gap: 1rem;
		justify-content: right;
		width: 100%;
		z-index: 99;
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
		gap: 1.5rem;
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

	.top-container {
		margin-bottom: 2rem;
		background-color: var(--accent-color);
		padding: 2rem;
		border-radius: 20px;
		display: flex;
		justify-content: space-between;
	}

	.top-container-text {
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
