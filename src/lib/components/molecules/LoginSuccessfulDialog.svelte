<script lang="ts">
	import Modal from './Modal.svelte';
	import Button from '../atoms/Button.svelte';
	import { auth } from '$stores';

	let open = $state(false);

function formatExpiry(expiry: number | null): string {
	if (!expiry) return '';
	const now = Date.now();
	const diff = expiry - now;
	if (diff <= 0) return 'expired';
	const hours = Math.floor(diff / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
	if (hours > 0) {
		return `${hours}h ${minutes}m`;
	}
	return `${minutes}m`;
}

$effect(() => {
	if (auth.loginSuccess) {
		open = true;
		const timer = setTimeout(() => {
			auth.clearLoginSuccess();
		}, 100);
		return () => clearTimeout(timer);
	}
});

function handleClose() {
	open = false;
	auth.clearLoginSuccess();
}
</script>

{#if open}
	<Modal title="Login successful" bind:open>
		<p>You have successfully logged in to the admin panel.</p>
		{#if auth.expiry}
			<p class="expiry-info">Session expires in <span>{formatExpiry(auth.expiry)}</span></p>
		{/if}
		{#snippet buttons()}
			<div class="button-row">
				<Button buttonStyle="filled" onclick={handleClose}>OK</Button>
			</div>
		{/snippet}
	</Modal>
{/if}

<style>
	p {
		color: var(--text-four);
		line-height: 1.6;
		margin: 0;
	}

	.button-row {
		display: flex;
		gap: 0.5rem;
		justify-content: flex-end;
	}
	.expiry-info {
		color: var(--text-four);
		font-size: 0.95rem;
		margin: 0.5rem 0 0.5rem 0;
	}
	.expiry-info span {
		color: var(--primary);
		font-weight: 500;
	}
</style>
