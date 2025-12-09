<script lang="ts">
	import { browser } from '$app/environment';
	import Page from '$components/molecules/Page.svelte';
	import DonateHeartAnimation from '$components/molecules/DonateHeartAnimation.svelte';
	import TeamMemberCard from '$components/molecules/TeamMemberCard.svelte';
	import DonateCard from '$components/molecules/DonateCard.svelte';
	import CryptoWalletList from '$components/molecules/CryptoWalletList.svelte';
	import Modal from '$components/molecules/Modal.svelte';
	import Button from '$components/atoms/Button.svelte';
	import QRCode from '$components/atoms/QRCode.svelte';
	import { aboutQuery, teamQuery } from '$stores';
	import type { CryptoWallet } from '$api';

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

	let cryptoModalOpen = $state(false);
	let walletModalOpen = $state(false);
	let selectedWallet = $state<CryptoWallet | null>(null);
	let copySuccess = $state(false);
	let walletLinkClicked = $state(false);

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
		walletLinkClicked = false;
	}

	function backToCryptoList() {
		walletModalOpen = false;
		cryptoModalOpen = true;
	}

	async function copyAddress() {
		if (!selectedWallet || !browser) return;

		try {
			await navigator.clipboard.writeText(selectedWallet.address);
			copySuccess = true;
			setTimeout(() => {
				copySuccess = false;
				walletModalOpen = false;
			}, 1500);
		} catch (error) {
			console.error('Failed to copy address:', error);
		}
	}
	const walletSchemes: Record<string, string> = {
		BTC: 'bitcoin',
		ETH: 'ethereum',
		LTC: 'litecoin',
		DOGE: 'dogecoin',
		XMR: 'monero'
	};

	function getWalletUri(wallet: CryptoWallet): string | null {
		const scheme = walletSchemes[wallet.currency_code];
		if (!scheme) return null;
		return `${scheme}:${wallet.address}`;
	}

	function handleWalletLinkClick() {
		if (!walletLinkClicked) {
			walletLinkClicked = true;
			setTimeout(() => {
				walletLinkClicked = false;
			}, 5000);
		}
	}
</script>

<Page title="Donate to ReVanced" description="Support ReVanced development" {schemas}>
	<main class="wrapper">
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
		<div class="donate-cards">
			{#each donationLinks as link}
				<DonateCard
					name={link.name}
					image={donateImages[link.name] ?? fallbackImg}
					href={link.url}
				/>
			{/each}
			{#if cryptoWallets.length > 0}
				<DonateCard
					name="Cryptocurrencies"
					image={donateImages['Cryptocurrencies']}
					onclick={() => (cryptoModalOpen = true)}
				/>
			{/if}
		</div>

		<h3>Meet the team</h3>
		<section class="team">
			{#each shuffledTeam as member}
				<TeamMemberCard {member} />
			{/each}
		</section>
	</main>
</Page>

<Modal id="crypto-modal" bind:open={cryptoModalOpen} title="Cryptocurrencies">
	<CryptoWalletList wallets={cryptoWallets} onSelect={openWalletModal} />
	{#snippet buttons()}
		<Button buttonStyle="filled" onclick={() => (cryptoModalOpen = false)}>Close</Button>
	{/snippet}
</Modal>

<Modal id="wallet-modal" bind:open={walletModalOpen} title="{selectedWallet?.currency_code ?? ''} Wallet">
	{#if selectedWallet}
		<div class="wallet-details">
			<p class="address">{selectedWallet.address}</p>
			<QRCode value={selectedWallet.address} size={180} />
			{#if getWalletUri(selectedWallet)}
				<a 
					href={getWalletUri(selectedWallet)} 
					class="open-wallet-link"
					onclick={handleWalletLinkClick}
				>
					Open in Wallet App
				</a>
				<div class="wallet-hint-container" class:visible={walletLinkClicked}>
					<p class="wallet-hint">
						Nothing happened? You may need a wallet app or browser extension installed.
					</p>
				</div>
			{/if}
		</div>
	{/if}
	{#snippet buttons()}
		<Button buttonStyle="text" onclick={backToCryptoList}>Back</Button>
		<Button buttonStyle="filled" onclick={copyAddress}>
			{copySuccess ? 'Copied!' : 'Copy Address'}
		</Button>
	{/snippet}
</Modal>

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

	.open-wallet-link {
		color: var(--primary);
		font-size: 0.9rem;
		font-weight: 500;
		text-decoration: none;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		background-color: var(--surface-seven);
		transition: background-color 0.2s ease;
	}

	.open-wallet-link:hover {
		background-color: var(--surface-five);
		text-decoration: underline;
	}

	.wallet-hint-container {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.3s ease, margin-top 0.3s ease;
		margin-top: 0;
	}

	.wallet-hint-container.visible {
		grid-template-rows: 1fr;
		margin-top: 0.5rem;
	}

	.wallet-hint-container > .wallet-hint {
		overflow: hidden;
		min-height: 0;
	}

	.wallet-hint {
		font-size: 0.8rem;
		color: var(--warning, #f0a020);
		background-color: color-mix(in srgb, var(--warning, #f0a020) 15%, transparent);
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.wallet-hint-container.visible > .wallet-hint {
		opacity: 1;
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
