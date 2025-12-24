<script lang="ts">
	import { browser } from '$app/environment';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Page from '$components/molecules/Page.svelte';
	import DonateHeartAnimation from '$components/molecules/DonateHeartAnimation.svelte';
	import TeamMemberCard from '$components/molecules/TeamMemberCard.svelte';
	import DonateCard from '$components/molecules/DonateCard.svelte';
	import CryptoWalletList from '$components/molecules/CryptoWalletList.svelte';
	import Modal from '$components/molecules/Modal.svelte';
	import Button from '$components/atoms/Button.svelte';
	import QRCode from '$components/atoms/QRCode.svelte';
	import Snackbar from '$components/atoms/Snackbar.svelte';
	import { aboutQuery, teamQuery } from '$stores';
	import type { CryptoWallet } from '$api';

	import IconCircles from 'virtual:icons/material-symbols/circles-ext';
	import IconWallet from 'virtual:icons/material-symbols/account-balance-wallet-outline';

	import openCollectiveImg from '$assets/donate/card-images/Open Collective.webp';
	import githubSponsorsImg from '$assets/donate/card-images/GitHub Sponsors.webp';
	import cryptocurrenciesImg from '$assets/donate/card-images/Cryptocurrencies.webp';
	import fallbackImg from '$assets/donate/card-images/fallback.svg';

	import revancedLogoBg from '$assets/icons/revanced-logo-background.svg';
	import heartIcon from '$assets/icons/heart.svg';

	const donateImages: Record<string, string> = {
		'Open Collective': openCollectiveImg,
		'GitHub Sponsors': githubSponsorsImg,
		'Cryptocurrencies': cryptocurrenciesImg
	};

	let donationLinks = $derived(aboutQuery.data?.donations?.links ?? []);
	let cryptoWallets = $derived(aboutQuery.data?.donations?.wallets ?? []);

	let teamMembers = $derived(teamQuery.data ?? []);

	// Loading/error states
	let isDonateLoading = $derived(aboutQuery.loading && donationLinks.length === 0);
	let isDonateError = $derived(aboutQuery.error && donationLinks.length === 0);
	let isTeamLoading = $derived(teamQuery.loading && teamMembers.length === 0);
	let isTeamError = $derived(teamQuery.error && teamMembers.length === 0);

	let cryptoModalOpen = $state(false);
	let walletModalOpen = $state(false);
	let selectedWallet = $state<CryptoWallet | null>(null);
	let copySuccess = $state(false);
	let snackbarOpen = $state(false);

	function shuffle<T>(array: T[]): T[] {
		return array
			.map((value) => ({ value, sort: Math.random() }))
			.sort((a, b) => a.sort - b.sort)
			.map(({ value }) => value);
	}

	let shuffledTeam = $derived(browser ? shuffle([...teamMembers]) : teamMembers);

	const schemas = [
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://revanced.app/' },
				{ '@type': 'ListItem', position: 2, name: 'Donate', item: 'https://revanced.app/donate' }
			]
		}
	];

	function openWalletModal(wallet: CryptoWallet) {
		selectedWallet = wallet;
		cryptoModalOpen = false;
		walletModalOpen = true;
	}

	function closeWalletModal() {
		walletModalOpen = false;
		cryptoModalOpen = true;
	}

	async function copyAddress() {
		if (!selectedWallet || !browser) return;

		try {
			await navigator.clipboard.writeText(selectedWallet.address);
			copySuccess = true;
			snackbarOpen = true;
			setTimeout(() => {
				copySuccess = false;
				walletModalOpen = false;
			}, 1500);
		} catch (error) {
			console.error('Failed to copy address:', error);
		}
	}
</script>

<Page title="Donate to ReVanced" description="Support ReVanced development" {schemas}>
	<main class="wrapper" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
		<section class="hero">
			<div class="hero-text">
				<h2>🎉 Support <span class="highlight">ReVanced</span></h2>
				<p>
					ReVanced offers a variety of patches, including ad-blocking, custom themes, and innovative
					features. All of which is completely open source and free of charge. Donating will allow
					ReVanced maintain our servers and develop new features.
				</p>
			</div>
		<div class="heart-animation">
				<DonateHeartAnimation
					backgroundImageUrl={revancedLogoBg}
					foregroundImageUrl={heartIcon}
					alt="ReVanced Logo"
				/>
			</div>
		</section>

		<h3>Donate</h3>
		{#if isDonateLoading}
			<div class="loading-state">
				<div class="skeleton-cards">
					<div class="skeleton-card"></div>
					<div class="skeleton-card"></div>
					<div class="skeleton-card"></div>
				</div>
			</div>
		{:else if isDonateError}
			<p class="error-state">Failed to load donation options. Please try again later.</p>
		{:else}
			<div class="donate-cards">
				{#key donationLinks.length}
					{#each donationLinks as link}
						<DonateCard
							name={link.name}
							image={donateImages[link.name] ?? fallbackImg}
							href={link.url}
						/>
					{/each}
				{/key}
				{#if cryptoWallets.length > 0}
					<DonateCard
						name="Cryptocurrencies"
						image={donateImages['Cryptocurrencies']}
						onclick={() => (cryptoModalOpen = true)}
					/>
				{/if}
			</div>
		{/if}

		<h3>Meet the team</h3>
		{#if isTeamLoading}
			<div class="loading-state">
				<div class="skeleton-team">
					{#each Array(6) as _}
						<div class="skeleton-member"></div>
					{/each}
				</div>
			</div>
		{:else if isTeamError}
			<p class="error-state">Failed to load team members. Please try again later.</p>
		{:else}
			<section class="team">
				{#key shuffledTeam.length}
					{#each shuffledTeam as member, i}
						<TeamMemberCard {member} {i} />
					{/each}
				{/key}
			</section>
		{/if}
	</main>
</Page>

<Modal bind:open={cryptoModalOpen} title="Cryptocurrencies">
	{#snippet icon()}
		<IconCircles style="width: 32px; height: 32px; color: var(--surface-six);" />
	{/snippet}
	<CryptoWalletList wallets={cryptoWallets} onSelect={openWalletModal} />
	{#snippet buttons()}
		<Button buttonStyle="filled" onclick={() => (cryptoModalOpen = false)}>Close</Button>
	{/snippet}
</Modal>

<Modal bind:open={walletModalOpen} title="{selectedWallet?.currency_code ?? ''} Wallet" onclose={closeWalletModal}>
	{#snippet icon()}
		<IconWallet style="width: 32px; height: 32px; color: var(--surface-six);" />
	{/snippet}
	{#if selectedWallet}
		<div class="wallet-details">
			<p class="address">{selectedWallet.address}</p>
			<QRCode value={selectedWallet.address} size={180} />
		</div>
	{/if}
	{#snippet buttons()}
		<Button buttonStyle="text" onclick={closeWalletModal}>Back</Button>
		<Button buttonStyle="filled" onclick={copyAddress}>
			{copySuccess ? 'Copied!' : 'Copy Address'}
		</Button>
	{/snippet}
</Modal>

<Snackbar bind:open={snackbarOpen}>
	{#snippet text()}
		Address copied to clipboard
	{/snippet}
</Snackbar>

<style>
	.wrapper {
		width: min(90%, 80rem);
		margin-inline: auto;
		display: flex;
		flex-direction: column;
		margin-bottom: 5rem;
		padding-top: 2rem;
	}

	.hero {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 2rem;
	}

	.hero-text h2 {
		margin-bottom: 0.5rem;
		color: var(--text-one);
	}

	.highlight {
		color: var(--primary);
	}

	.hero-text p {
		margin-bottom: 2rem;
		width: 60%;
		color: var(--text-four);
	}

	.heart-animation {
		flex-shrink: 0;
	}

	h3 {
		margin-bottom: 1.5rem;
	}

	.donate-cards {
		display: flex;
		gap: 1rem;
		margin-bottom: 3rem;
	}

	.loading-state {
		margin-bottom: 3rem;
	}

	.error-state {
		color: var(--text-four);
		margin-bottom: 3rem;
	}

	.skeleton-cards {
		display: flex;
		gap: 1rem;
	}

	.skeleton-card {
		width: 200px;
		height: 120px;
		background: linear-gradient(90deg, var(--surface-three) 25%, var(--surface-four) 50%, var(--surface-three) 75%);
		background-size: 200% 100%;
		border-radius: 12px;
		animation: shimmer 1.5s infinite;
	}

	.skeleton-team {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(325px, 1fr));
		gap: 1rem;
	}

	.skeleton-member {
		height: 80px;
		background: linear-gradient(90deg, var(--surface-three) 25%, var(--surface-four) 50%, var(--surface-three) 75%);
		background-size: 200% 100%;
		border-radius: 12px;
		animation: shimmer 1.5s infinite;
	}

	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	.team {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(325px, 1fr));
		justify-content: space-between;
		align-items: stretch;
		gap: 1rem;
	}

	.wallet-details {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		text-align: center;
	}

	.address {
		word-break: break-all;
		font-family: monospace;
		font-size: 0.85rem;
		color: var(--text-four);
		padding: 1rem;
		background-color: var(--surface-seven);
		border-radius: 8px;
		max-width: 100%;
	}

	@media (max-width: 1200px) {
		.hero-text p {
			width: 90%;
		}
	}

	@media (max-width: 768px) {
		.hero {
			flex-direction: column-reverse;
		}

		.hero-text p {
			width: 100%;
		}

		.heart-animation {
			display: none;
		}

		.donate-cards {
			flex-direction: column;
		}
	}
</style>
