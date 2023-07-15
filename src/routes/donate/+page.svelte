<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	import type { TeamMember } from '$lib/types';

	import Meta from '$lib/components/Meta.svelte';
	import Footer from '$layout/Footer/FooterHost.svelte';
	import Button from '$lib/components/Button.svelte';
	import Snackbar from '$lib/components/Snackbar.svelte';

	import team from './team.json';
	import cryptocurrency from './cryptocurrency.json';

	let teamShuffled: TeamMember[] = [];
	let snackbarOpen = false;

	onMount(async () => {
		teamShuffled = team.sort(() => (Math.random() > 0.5 ? -1 : 1));
	});

	async function copyToClipboard(e) {
		snackbarOpen = true;
		try {
			const walletAddress = e.target.innerText;
			await navigator.clipboard.writeText(walletAddress);
		} catch (error) {
			console.error('failed to copy crypto wallet:', error);
		}
	}
</script>

<Meta title="Donate" />

<main class="wrapper" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	<h2>🎉 Support <span style="color: var(--accent-color);">ReVanced</span></h2>
	<p>
		ReVanced offers a variety of patches, including ad-blocking, custom themes, and innovative
		features. All of which is completely open source and free of charge. Donating will allow
		ReVanced maintain our servers and develop new features.
	</p>

	<div class="buttons-container">
		<Button type="filled" href="https://opencollective.com/revanced">Open Collective</Button>
		<Button type="tonal" href="https://github.com/sponsors/ReVanced">GitHub Sponsors</Button>
	</div>
	<div class="table-container">
		<table>
			<thead>
				<th colspan="3"><h4>Crypto</h4></th>
			</thead>
			<tbody>
				{#each cryptocurrency as crypto}
					<tr>
						<td><h5>{crypto.name}</h5></td>
						<td>
							<button on:click={copyToClipboard}>
								<h6>{crypto.address}</h6>
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<h3>Meet the team</h3>
	<section class="team">
		{#each teamShuffled as member, i}
			<a
				class="member"
				href={`https://github.com/${member.github}`}
				rel="noreferrer"
				target="_blank"
				in:fly={{ y: 10, easing: quintOut, duration: 750, delay: 50 * i }}
			>
				<img
					src={`https://github.com/${member.github}.png`}
					alt={`${member.name}'s profile picture.'`}
				/>

				<div class="member-text">
					<h4>{member.name}</h4>
					<h6>{member.message}</h6>
				</div>
			</a>
		{/each}
	</section>
</main>

<Snackbar bind:open={snackbarOpen} closeIcon>
	<svelte:fragment slot="text">Address copied to clipboard</svelte:fragment>
</Snackbar>

<Footer />

<style lang="scss">
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	h2 {
		text-align: center;
		margin-bottom: 0.5rem;
		color: var(--white);
	}

	p {
		text-align: center;
		margin-bottom: 2rem;
		width: 60%;
	}

	h3 {
		margin-bottom: 1.5rem;
	}

	.buttons-container {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.table-container {
		border: 1px solid var(--grey-three);
		border-radius: 20px;
		overflow: hidden;
		margin-bottom: 3rem;
	}

	table {
		border-collapse: collapse;
		overflow: hidden;
		margin-right: -1px;
		margin-bottom: -1px;
	}

	th {
		background-color: var(--grey-six);
		text-align: center;
		padding: 0.5rem;
		border-bottom: 1px solid var(--grey-three);
	}

	button {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		text-align: left;
	}

	td {
		padding: 0.9rem 1rem;
		border-right: 1px solid var(--grey-three);
		border-bottom: 1px solid var(--grey-three);

		&:not(:first-child) {
			word-break: break-all;
		}
	}

	.team {
		width: 50%;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 4rem;
		justify-content: space-evenly;
	}

	.member {
		width: 144px;
		color: var(--white);
		border: 1px solid var(--grey-three);
		text-decoration: none;
		cursor: pointer;
		padding: 1rem;
		border-radius: 12px;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		transition: 0.3s background-color var(--bezier-one);

		img {
			border-radius: 50%;
			height: 64px;
			width: 64px;
			transition: transform 0.4s var(--bezier-one);
			user-select: none;
			margin-bottom: 1rem;
		}

		.member-text {
			display: flex;
			flex-direction: column;
		}

		&:hover {
			background-color: var(--grey-six);
		}
	}

	@media screen and (max-width: 1000px) {
		p {
			width: 90%;
		}

		.team {
			width: 75%;
		}
	}

	@media screen and (max-width: 768px) {
		p {
			width: 100%;
		}

		.team {
			width: 100%;
		}

		.member {
			width: 100%;
			flex-direction: row;
			gap: 1rem;
		}

		.member img {
			margin-bottom: 0;
			height: 48px;
			width: 48px;
		}

		.member-text {
			text-align: left;
		}
	}
</style>
