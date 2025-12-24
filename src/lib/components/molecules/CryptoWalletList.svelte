<script lang="ts">
	import type { CryptoWallet } from '$api';
	import IconChevronRight from 'virtual:icons/material-symbols/chevron-right';

	const cryptoIcons = import.meta.glob('$assets/donate/crypto/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
	import fallbackIcon from '$assets/donate/crypto/fallback.svg';

	type Props = {
		wallets: CryptoWallet[];
		onSelect?: (wallet: CryptoWallet) => void;
	};

	let { wallets, onSelect }: Props = $props();

	function getCryptoIcon(currencyCode: string): string {
		const key = Object.keys(cryptoIcons).find(k => k.includes(`/${currencyCode}.svg`));
		return key ? cryptoIcons[key] : fallbackIcon;
	}
</script>

<div class="wallets">
	{#key wallets.length}
		{#each wallets as wallet}
			<button type="button" class="wallet" onclick={() => onSelect?.(wallet)}>
				<div class="wallet-name">
					<img src={getCryptoIcon(wallet.currency_code)} alt="{wallet.network} icon" />
					<span>{wallet.network} ({wallet.currency_code})</span>
				</div>
				<div class="arrow">
					<IconChevronRight />
				</div>
			</button>
		{/each}
	{/key}
</div>

<style>
	.wallets {
		width: 100%;
		max-width: 375px;
		border-radius: 12px;
		overflow: hidden;
		border: 1px solid var(--border);
	}

	.wallet {
		width: 100%;
		font-size: 0.9rem;
		font-family: inherit;
		background-color: var(--surface-seven);
		border: none;
		color: var(--text-four);
		cursor: pointer;
		text-align: left;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1.25rem;
		transition: filter 0.4s var(--bezier-one);
	}

	.wallet:not(:last-child) {
		border-bottom: 1px solid var(--border);
	}

	.wallet:hover {
		filter: brightness(85%);
	}

	.wallet-name {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.wallet-name img {
		height: 24px;
		width: 24px;
	}

	.arrow {
		height: 20px;
		color: var(--surface-six);
	}

	.arrow :global(svg) {
		width: 20px;
		height: 20px;
	}
</style>
