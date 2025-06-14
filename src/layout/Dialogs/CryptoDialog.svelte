<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$layout/Dialogs/Dialog.svelte';
	import CircleMultipleOutline from 'svelte-material-icons/CircleMultipleOutline.svelte';
	import ChevronUp from 'svelte-material-icons/ChevronUp.svelte';
	import QRCode from '$lib/components/QRCode.svelte';
	import WalletOutline from 'svelte-material-icons/WalletOutline.svelte';
	import Snackbar from '$lib/components/Snackbar.svelte';

	export let dialogOpen: boolean;
	export let wallets;

	let qrCodeValue = '';
	let qrCodeDialogueName = '';
	let qrCodeDialogue = false;
	let addressSnackbar = false;

	async function copyToClipboard(walletAddress: string) {
		addressSnackbar = true;
		qrCodeDialogue = false;

		try {
			await navigator.clipboard.writeText(walletAddress);
		} catch (error) {
			console.error('Failed to copy crypto wallet:', error);
		}
	}
</script>

<Dialog bind:dialogOpen>
	<svelte:fragment slot="icon">
		<CircleMultipleOutline size="32px" color="var(--surface-six)" />
	</svelte:fragment>
	<svelte:fragment slot="title">Cryptocurrencies</svelte:fragment>
	<svelte:fragment slot="description">
		<hr style="margin: 1rem 0;" />
		<div class="wallets">
			{#each wallets as wallet}
				<button
					on:click={() => {
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
							onerror="this.onerror=null; this.src='/donate/fallback.svg'"
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
	</svelte:fragment>
	<svelte:fragment slot="buttons">
		<Button type="filled" on:click={() => (dialogOpen = false)}>Close</Button>
	</svelte:fragment>
</Dialog>

<Dialog bind:dialogOpen={qrCodeDialogue}>
	<svelte:fragment slot="icon">
		<WalletOutline size="32px" color="var(--surface-six)" />
	</svelte:fragment>
	<svelte:fragment slot="title">{qrCodeDialogueName} Wallet</svelte:fragment>
	<svelte:fragment slot="description">
		<div class="qr-code-body">
			{qrCodeValue}
			<QRCode codeValue={qrCodeValue} />
		</div>
	</svelte:fragment>
	<svelte:fragment slot="buttons">
		<Button
			type="text"
			on:click={() => {
				qrCodeDialogue = false;
				dialogOpen = true;
			}}>Back</Button
		>
		<Button type="filled" on:click={() => copyToClipboard(qrCodeValue)}>Copy Address</Button>
	</svelte:fragment>
</Dialog>

<Snackbar bind:open={addressSnackbar}>
	<svelte:fragment slot="text">Address copied to clipboard</svelte:fragment>
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
