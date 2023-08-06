<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Meta from '$lib/components/Meta.svelte';
	import Footer from '$layout/Footer/FooterHost.svelte';
	import Button from '$lib/components/Button.svelte';
	import Snackbar from '$lib/components/Snackbar.svelte';
	import QRCode from './QRCode.svelte';

	import { queries } from '$data/api';
	import { createQuery } from '@tanstack/svelte-query';
	import Query from '$lib/components/Query.svelte';
	import Dialogue from '$lib/components/Dialogue.svelte';

	let qrCodeDialogue = false;
	let qrCodeValue = '';
	let qrCodeDialogueName = '';
	const teamQuery = createQuery(['team'], queries.team);
	const donateQuery = createQuery(['donate'], queries.donate);
	let snackbarOpen = false;

	async function copyToClipboard(walletAddress: string) {
		snackbarOpen = true;
		try {
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
	<Query query={donateQuery} let:data>
		{#if data.platforms.length > 0}
			<div class="buttons-container">
				{#each data.platforms as platform, i}
					{#if i === 0}
						<Button type="filled" href={platform.url}>{platform.name}</Button>
					{:else}
						<Button type="tonal" href={platform.url}>{platform.name}</Button>
					{/if}
				{/each}
			</div>
		{/if}
		{#if data.wallets.length > 0}
			<div class="table-container">
				<table>
					<thead>
						<th colspan="3"><h4>Crypto</h4></th>
					</thead>
					<tbody>
						{#each data.wallets as wallet}
							<tr>
								<td><h5>{wallet.name}</h5></td>
								<td class="wallet-content">
									<button on:click={() => copyToClipboard(wallet.address)}>
										<h6>{wallet.address}</h6>
									</button>
									<Button
										type="text"
										on:click={() => {
											qrCodeValue = wallet.address;
											qrCodeDialogueName = wallet.name
											qrCodeDialogue = !qrCodeDialogue;
										}}
									>
										<img class="qr-code-button" src="/icons/qr_code.svg" alt="QR Code" />
									</Button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</Query>
	<Query query={teamQuery} let:data>
		<h3>Meet the team</h3>
		{#if data.members.length > 0}
			<section class="team">
				{#each data.members.sort(() => (Math.random() > 0.5 ? -1 : 1)) as member, i}
					<a
						class="member"
						href={member.html_url}
						rel="noreferrer"
						target="_blank"
						in:fly={{ y: 10, easing: quintOut, duration: 750, delay: 50 * i }}
					>
						<img src={member.avatar_url} alt={`${member.login}'s profile picture.'`} />

						<div class="member-text">
							<h4>{member.login}</h4>
							{#if member.bio}
								<h6>{member.bio}</h6>
							{/if}
						</div>
					</a>
				{/each}
			</section>
		{/if}
	</Query>
</main>

<Dialogue bind:modalOpen={qrCodeDialogue}>
	<svelte:fragment slot="icon">
		<img class="qr-code" src="/icons/qr_code.svg" alt="QR Code" />
	</svelte:fragment>
	<svelte:fragment slot="title">Scan QR Code</svelte:fragment>
	<svelte:fragment slot="description">
		<div class="qr-code-body">
			{qrCodeDialogueName} Wallet
			<QRCode codeValue={qrCodeValue} squareSize="200" />
		</div>
	</svelte:fragment>
	<svelte:fragment slot="buttons">
		<Button type="filled" on:click={() => (qrCodeDialogue = false)}>Close</Button>
	</svelte:fragment>
</Dialogue>

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
		text-align: center;
		vertical-align: middle;
		padding: 0.9rem 1rem;
		border-right: 1px solid var(--grey-three);
		border-bottom: 1px solid var(--grey-three);
		&.wallet-content {
			display: flex;
			justify-content: space-between;
			gap: 2rem;
		}

		&:not(:first-child) {
			word-break: break-all;
		}
	}

	.qr-code-body {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		word-break: break-word;
		text-align: center;
	}

	.qr-code-button {
		color: var(--white);
		transition: all 0.2s var(--bezier-one);
		user-select: none;
		height: 2rem;
	}

	.team {
		width: 85%;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 4rem;
		justify-content: space-evenly;
	}

	.member {
		width: 350px;
		color: var(--white);
		border: 1px solid var(--grey-three);
		text-decoration: none;
		cursor: pointer;
		padding: 1rem;
		border-radius: 12px;
		display: flex;

		gap: 1rem;
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
			word-break: break-word;
		}

		&:hover {
			background-color: var(--grey-six);
		}
	}

	@media screen and (max-width: 1420px) {
		.team {
			width: 100%;
		}

		.member {
			width: 325px;
		}
	}

	@media screen and (max-width: 1000px) {
		p {
			width: 90%;
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
			gap: 1rem;
		}

		.member img {
			margin-bottom: 0;
			height: 48px;
			width: 48px;
		}
	}
</style>
