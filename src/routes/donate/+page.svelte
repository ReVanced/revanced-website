<script lang="ts">
	import { browser } from '$app/environment';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Page from '$components/templates/Page.svelte';
	import DonateHeartAnimation from '$components/molecules/DonateHeartAnimation.svelte';
	import TeamMemberCard from '$components/molecules/TeamMemberCard.svelte';
	import DonateCard from '$components/molecules/DonateCard.svelte';
	import CryptoWalletList from '$components/molecules/CryptoWalletList.svelte';
	import Modal from '$components/molecules/Modal.svelte';
	import Button from '$components/atoms/Button.svelte';
	import QRCode from '$components/atoms/QRCode.svelte';
	import Snackbar from '$components/atoms/Snackbar.svelte';
	import type { CryptoWallet } from '$api';

	import IconCircles from 'svelte-material-icons/CircleMultipleOutline.svelte';
	import IconWallet from 'svelte-material-icons/WalletOutline.svelte';

	import openCollectiveImg from '$assets/donate/card-images/Open Collective.webp';
	import githubSponsorsImg from '$assets/donate/card-images/GitHub Sponsors.webp';
	import cryptocurrenciesImg from '$assets/donate/card-images/Cryptocurrencies.webp';
	import fallbackImg from '$assets/donate/card-images/fallback.svg';

	import revancedLogoBg from '$assets/icons/revanced-logo-background.svg';
	import heartIcon from '$assets/icons/heart.svg';

	let { data } = $props();

	const donateImages: Record<string, string> = {
		'Open Collective': openCollectiveImg,
		'GitHub Sponsors': githubSponsorsImg,
		'Cryptocurrencies': cryptocurrenciesImg
	};

	let donationLinks = $derived(data.about?.donations?.links ?? []);
	let cryptoWallets = $derived(data.about?.donations?.wallets ?? []);

	let teamMembers = $derived(data.team ?? []);

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

<Page title="Donate to ReVanced" description="Donate to ReVanced with a variety of donation methods, including cryptocurrencies in order to allow us to maintain our servers and develop new features." {schemas}>
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
			{#each shuffledTeam as member, i}
				<TeamMemberCard {member} {i} />
			{/each}
		</section>
	</main>
</Page>

<Modal bind:open={cryptoModalOpen} title="Cryptocurrencies">
	{#snippet icon()}
		<IconCircles size={32} color="var(--surface-six)" />
	{/snippet}
	<hr class="crypto-divider" />
	<CryptoWalletList wallets={cryptoWallets} onSelect={openWalletModal} />
	{#snippet buttons()}
		<Button buttonStyle="filled" onclick={() => (cryptoModalOpen = false)}>Close</Button>
	{/snippet}
</Modal>

<Modal bind:open={walletModalOpen} title="{selectedWallet?.currency_code ?? ''} Wallet" onclose={closeWalletModal}>
	{#snippet icon()}
		<IconWallet size={32} color="var(--surface-six)" />
	{/snippet}
	{#if selectedWallet}
		<div class="wallet-details">
			<p class="address">{selectedWallet.address}</p>
			<QRCode value={selectedWallet.address} size={150} />
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
		margin-top: 2.6rem;
	}

	.hero {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 2rem;

		.hero-text {
			h2 {
				margin-bottom: 0.5rem;
				color: var(--text-one);
			}

			p {
				margin-bottom: 2rem;
				width: 60%;
				color: var(--text-four);
			}
		}
	}

	.highlight {
		color: var(--primary);
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
		word-break: break-word;
		text-align: center;
	}

	.address {
		font-family: inherit;
		font-size: 1rem;
		color: var(--text-four);
	}

	.crypto-divider {
		margin: 1rem 0;
		width: 100%;
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
