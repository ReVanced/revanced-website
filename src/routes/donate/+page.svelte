<script lang="ts">
	import { fly, slide } from 'svelte/transition';
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
	let expandCrypto = false;

	async function copyToClipboard(walletAddress: string) {
		snackbarOpen = true;
		qrCodeDialogue = false;
		try {
			await navigator.clipboard.writeText(walletAddress);
		} catch (error) {
			console.error('Failed to copy crypto wallet:', error);
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
		{#if data.platforms}
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
		{#if data.wallets}
			<div class="crypto-card">
				<div
					class="crypto-title"
					class:closed={!expandCrypto}
					on:click={() => (expandCrypto = !expandCrypto)}
					on:keypress={() => (expandCrypto = !expandCrypto)}
				>
					<h4>Crypto</h4>
					<img
						id="arrow"
						style:transform={expandCrypto ? 'rotate(0deg)' : 'rotate(-180deg)'}
						src="/icons/expand_less.svg"
						alt="dropdown"
					/>
				</div>
				{#if expandCrypto}
					<hr />
					<div class="wallets" transition:slide|local={{ easing: quintOut, duration: 500 }}>
						{#each data.wallets as wallet}
							<button
								on:click={() => {
									qrCodeValue = wallet.address;
									qrCodeDialogueName = wallet.currency_code.toUpperCase();
									qrCodeDialogue = !qrCodeDialogue;
								}}
							>
								<div class="name">
									<img src="/donate/{wallet.currency_code}.svg" alt={`${wallet.network} icon.'`} />
									{`${wallet.network} (${wallet.currency_code.toUpperCase()})`}
								</div>
								<img id="arrow" src="/icons/expand_less.svg" alt="dropdown" />
							</button>
						{/each}
					</div>
				{/if}
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
		<img class="qr-code" src="/icons/wallet.svg" alt="QR Code" />
	</svelte:fragment>
	<svelte:fragment slot="title">{qrCodeDialogueName} Wallet</svelte:fragment>
	<svelte:fragment slot="description">
		<div class="qr-code-body">
			{qrCodeValue}
			<QRCode codeValue={qrCodeValue} />
		</div>
	</svelte:fragment>
	<svelte:fragment slot="buttons">
		<Button type="text" on:click={() => (qrCodeDialogue = false)}>Close</Button>
		<Button type="filled" on:click={() => copyToClipboard(qrCodeValue)}>Copy Address</Button>
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

	.crypto-card {
		border-radius: 20px;
		width: clamp(325px, 50vw, 375px);
		margin-bottom: 2rem;
		border: 1px solid var(--grey-three);
		overflow: hidden;

		hr {
			opacity: 0.75;
		}
	}

	.crypto-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		cursor: pointer;
		background-color: var(--grey-six);
		padding: 0.75rem 1.25rem;
		transition: all 0.2s var(--bezier-one);

		&:hover {
			background-color: var(--grey-one);
		}
		#arrow {
			height: 1.5rem;
			transition: all 0.2s var(--bezier-one);
			user-select: none;
		}
	}

	.wallets {
		padding: 0.5rem 0;
		#arrow {
			height: 20px;
			transform: rotate(90deg);
		}

		button {
			width: 100%;
			font-size: 0.9rem;
			background-color: transparent;
			border: none;
			color: var(--grey-five);
			cursor: pointer;
			text-align: left;
			display: flex;
			justify-content: space-between;
			background-color: var(--bg-color);
			padding: 0.75rem 1.25rem;
			transition: filter 0.4s var(--bezier-one);

			&:hover {
				filter: brightness(85%);
			}
		}
	}

	.name {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.name img {
		height: 24px;
		width: 24px;
	}

	.buttons-container {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.qr-code-body {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		word-break: break-word;
		text-align: center;
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
