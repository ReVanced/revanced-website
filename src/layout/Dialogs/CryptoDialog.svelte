<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$layout/dialogs/Dialog.svelte';
	import CircleMultipleOutline from 'svelte-material-icons/CircleMultipleOutline.svelte';
	import ChevronUp from 'svelte-material-icons/ChevronUp.svelte';
	import QRCode from '$lib/components/QRCode.svelte';
	import WalletOutline from 'svelte-material-icons/WalletOutline.svelte';
	import Snackbar from '$lib/components/Snackbar.svelte';

	let {
		dialogOpen = $bindable(false),
		wallets
	}: {
		dialogOpen?: boolean;
		wallets: any;
	} = $props();

	let qrCodeValue = $state('');
	let qrCodeDialogueName = $state('');
	let qrCodeDialogue = $state(false);
	let addressSnackbar = $state(false);

	async function copyToClipboard(walletAddress: string) {
		addressSnackbar = true;
		qrCodeDialogue = false;

		try {
			await navigator.clipboard.writeText(walletAddress);
		} catch (error) {
			console.error('Failed to copy crypto wallet:', error);
		}
	}

	function handleError(event: Event) {
		const target = event.target as HTMLImageElement;
		target.onerror = null;
		target.src = '/donate/fallback.svg';
	}
</script>

<Dialog bind:dialogOpen>
	{#snippet icon()}
		<CircleMultipleOutline size="32px" color="var(--surface-six)" />
	{/snippet}
	{#snippet title()}Cryptocurrencies{/snippet}
	{#snippet description()}
		<hr style="margin: 1rem 0;" />
		<div class="wallets">
			{#each wallets as wallet}
				<button
					onclick={() => {
						qrCodeValue = wallet.address;
						qrCodeDialogueName = wallet.currency_code;
						qrCodeDialogue = !qrCodeDialogue;
						// when the user clicks a wallet the crypto wallet goes away
						// because multi page dialogues aren't implemented yet oops
						dialogOpen = false;
					}}
				>
					<div class="wallet-name">
						 <img
						  src="/donate/crypto/{wallet.currency_code}.svg"
						  onerror={handleError}
						  alt={`${wallet.network} icon.'`}
						 />
						{`${wallet.network} (${wallet.currency_code})`}
					</div>
					<div id="arrow">
						<ChevronUp size="20px" color="var(--surface-six)" />
					</div>
				</button>
			{/each}
		</div>
	{/snippet}
	{#snippet buttons()}
		<Button type="filled" onclick={() => (dialogOpen = false)}>Close</Button>
	{/snippet}
</Dialog>

<Dialog bind:dialogOpen={qrCodeDialogue}>
	{#snippet icon()}
		<WalletOutline size="32px" color="var(--surface-six)" />
	{/snippet}
	{#snippet title()}{qrCodeDialogueName} Wallet{/snippet}
	{#snippet description()}
		<div class="qr-code-body">
			{qrCodeValue}
			<QRCode codeValue={qrCodeValue} />
		</div>
	{/snippet}
	{#snippet buttons()}
		<Button
			type="text"
			onclick={() => {
				qrCodeDialogue = false;
				dialogOpen = true;
			}}>Back</Button
		>
		<Button type="filled" onclick={() => copyToClipboard(qrCodeValue)}>Copy Address</Button>
	{/snippet}
</Dialog>

<Snackbar bind:open={addressSnackbar}>
	{#snippet text()}Address copied to clipboard{/snippet}
</Snackbar>

<style lang="scss">
	.wallets {
		// i just guessed this
		width: clamp(200px, 75vw, 375px);
		#arrow {
			height: 20px;
			transform: rotate(90deg);
		}

		button {
			width: 100%;
			font-size: 0.9rem;
			background-color: transparent;
			border: none;
			color: var(--text-four);
			cursor: pointer;
			text-align: left;
			display: flex;
			justify-content: space-between;
			background-color: var(--surface-seven);
			padding: 0.75rem 1.25rem;
			transition: filter 0.4s var(--bezier-one);

			&:hover {
				filter: brightness(85%);
			}
		}

		.wallet-name {
			display: flex;
			align-items: center;
			gap: 0.5rem;

			// crypto icon
			img {
				height: 24px;
				width: 24px;
			}
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
</style>
