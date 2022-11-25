<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import LogoOption from '$lib/components/atoms/LogoOption.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import { onMount } from 'svelte';

	let selected: Array<string> = [];
	let logos = [];
	onMount(async () => {
		const response = await fetch('https://poll.revanced.app/logos');
		const json = await response.json();
		// guh
		for (const name of Object.keys(json)) {
			logos.push({ name, ...json[name] });
		}
		// update ui
		logos = logos;
	});
</script>

<svelte:head>
	<title>ReVanced | Contributors</title>
	<meta content="ReVanced | Contributors" name="og:title" />
	<meta content="ReVanced | Contributors" name="twitter:title" />
</svelte:head>

<main>
	<div class="wrapper">
		<div class="top-container">
				<h1>ReVanced Logo Poll</h1>
				<h2>{selected.length}/4 selected· Page 1/6</h2>
				<div class="top-custom-button-container">
					<button>Help</button>
					<button>Website</button>
				</div>
		</div>
		<div class="options-grid">
			{#if logos.length > 0}
			<LogoOption bind:selected id={logos[0].id} logo={logos[0].gdrive_direct_url} name={logos[0].name} file={logos[0].filename}/>
			<LogoOption bind:selected id={logos[1].id} logo={logos[1].gdrive_direct_url} name={logos[1].name} file={logos[1].filename}/>
			<LogoOption bind:selected id={logos[2].id} logo={logos[2].gdrive_direct_url} name={logos[2].name} file={logos[2].filename}/>
			<LogoOption bind:selected id={logos[3].id} logo={logos[3].gdrive_direct_url} name={logos[3].name} file={logos[3].filename}/>
			{/if}
		</div>
		

		<div class="buttons-container">
			<Button>Previous</Button>
			<Button kind="primary" href="https://next.com">Next</Button>
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
		border:none;
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
