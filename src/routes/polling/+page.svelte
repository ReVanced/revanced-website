<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import ContributorPerson from '$lib/components/atoms/ContributorPerson.svelte';
	import Button from '$lib/components/atoms/Button.svelte';

	let selected = [];
</script>

<svelte:head>
	<title>ReVanced | Contributors</title>
	<meta content="ReVanced | Contributors" name="og:title" />
	<meta content="ReVanced | Contributors" name="twitter:title" />
</svelte:head>

<main>
	<div class="wrapper">
		<div class="text-container">
			<h1>Page 1/5</h1>
		</div>
		<div class="contrib-grid">
			<ContributorPerson pfp = "https://cdn.discordapp.com/emojis/267559535919497217.webp?size=48&quality=lossless" name="afn" />
			<ContributorPerson pfp = "https://cdn.discordapp.com/emojis/267559535919497217.webp?size=48&quality=lossless" name="afn 2" />
			<ContributorPerson pfp = "https://cdn.discordapp.com/emojis/267559535919497217.webp?size=48&quality=lossless" name="afn 3" />
			<ContributorPerson pfp = "https://cdn.discordapp.com/emojis/267559535919497217.webp?size=48&quality=lossless" name="yes" />
		</div>

		<div class="buttons-container">
			<Button>Previous</Button>
			<Button kind="primary" href="https://next.com">Next</Button>
		</div>
	</div>
</main>

<style>
	.contrib-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 3rem;
	}

	h1 {
		font-size: 2.25rem;
		font-weight: 600;
		text-align: center;
		color: var(--grey-four);
	}
	h2 {
		font-size: 1rem;
		color: var(--grey-four);
		text-align: center;
	}

	.buttons-container {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		justify-content: right;
		float: bottom;
	}

	.text-container {
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 2rem;
		background-color: var(--accent-color);
		padding: 2rem;
		border-radius: 8px;
	}
	@media screen and (max-width: 768px) {
		h1 {
			font-size: 2rem;
		}

		.contrib-grid {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));;

		}
	}
</style>
