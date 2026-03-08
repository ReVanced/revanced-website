<script lang="ts">
	import Modal from '$components/molecules/Modal.svelte';
	import Button from '$components/atoms/Button.svelte';
	import { auth } from '$stores';

	let modalOpen = $derived(auth.sessionExpired);

	function handleLogout() {
		auth.logout();
		auth.clearSessionExpired();
	}

	function handleLogin() {
		auth.clearSessionExpired();
		auth.requestLoginModal();
	}

	function handleClose() {
		handleLogout();
	}
</script>

<Modal
	title="Session expired"
	open={modalOpen}
	onclose={handleClose}
>
	<p>Your session has expired. Please log in again to continue, or log out to browse as a guest.</p>

	{#snippet buttons()}
		<div class="button-row">
			<Button buttonStyle="tonal" onclick={handleLogout}>Logout</Button>
			<Button onclick={handleLogin}>Login</Button>
		</div>
	{/snippet}
</Modal>

<style>
	p {
		color: var(--text-four);
		line-height: 1.5;
	}

	.button-row {
		display: flex;
		gap: 0.5rem;
		justify-content: flex-end;
	}
</style>
