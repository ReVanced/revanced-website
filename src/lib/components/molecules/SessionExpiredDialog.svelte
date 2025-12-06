<script lang="ts">
	import Modal from './Modal.svelte';
	import Button from '../atoms/Button.svelte';
	import { auth } from '$stores';

	function handleOk() {
		auth.clearSessionExpired();
	}

	function handleLogin() {
		auth.clearSessionExpired();
		auth.requestLoginModal();
	}
</script>

{#if auth.sessionExpired}
	<Modal title="Session expired" open={true}>
		<p>Your session has expired. Please log in again to continue.</p>

		{#snippet buttons()}
			<div class="button-row">
				<Button onclick={handleOk}>OK</Button>
				<Button onclick={handleLogin}>Login</Button>
			</div>
		{/snippet}
	</Modal>
{/if}

<style>
	p {
		color: var(--color-text-secondary);
		line-height: 1.5;
	}

	.button-row {
		display: flex;
		gap: 0.5rem;
		justify-content: flex-end;
	}
</style>
