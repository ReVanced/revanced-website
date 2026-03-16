<script lang="ts">
	import Modal from '$components/molecules/Modal.svelte';
	import Button from '$components/atoms/Button.svelte';
	import Settings from 'svelte-material-icons/Cog.svelte';
	import { auth } from '$stores';

	interface Props {
		open: boolean;
	}

	let { open = $bindable() }: Props = $props();

	let loginForm: HTMLFormElement | undefined = $state();
	let token = $state('');
	let error = $state('');
	let loading = $state(false);

	$effect(() => {
		if (!open) {
			token = '';
			error = '';
			loading = false;
		}
	});

	function handleLoginClick() {
		loginForm?.requestSubmit();
	}

	function handleLogoutClick() {
		auth.logout();
		open = false;
	}

	function handleFormSubmit(event: SubmitEvent) {
		event.preventDefault();

		error = '';
		loading = true;

		const result = auth.login(token);

		loading = false;

		if (result.success) {
			open = false;
			token = '';
		} else {
			error = result.error;
		}
	}

	function handleTokenKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !loading) {
			loginForm?.requestSubmit();
		}
	}
</script>

<Modal bind:open title="Settings">
	{#snippet icon()}
		<Settings size={24} color="var(--surface-six)" />
	{/snippet}
	<div id="settings-content">
		{#if auth.isLoggedIn}
			<p>You are logged in as a site administrator.</p>
		{:else}
			<div class="login-content">
				<p>Site administrator access requires login.</p>

				{#if error}
					<p class="error-message">{error}</p>
				{/if}

				<form class="login-form" bind:this={loginForm} onsubmit={handleFormSubmit}>
					<div class="input-group">
						<input
							type="password"
							id="settings-login-token"
							name="token"
							autocomplete="off"
							bind:value={token}
							placeholder=" "
							class="login-input rounded"
							disabled={loading}
							onkeydown={handleTokenKeydown}
							required
						/>
						<label for="settings-login-token" class="login-label">API Token</label>
					</div>
				</form>
			</div>
		{/if}
	</div>
	{#snippet buttons()}
		<div class="modal-buttons">
			{#if auth.isLoggedIn}
				<span class="status-text">Logged in</span>
				<Button buttonStyle="text" onclick={handleLogoutClick}>Logout</Button>
			{:else}
				<Button buttonStyle="text" onclick={handleLoginClick} disabled={loading}>
					{loading ? 'Logging in...' : 'Login'}
				</Button>
			{/if}
		</div>
	{/snippet}
</Modal>

<style>
	#settings-content {
		width: 100%;
	}

	#settings-content p {
		color: var(--text-four);
	}

	.login-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		margin-top: 0.5rem;
	}

	.login-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
	}

	.input-group {
		position: relative;
		width: 100%;
	}

	.login-input {
		width: 100%;
		padding: 0.75rem 1rem;
		background-color: var(--surface-three);
		color: var(--secondary);
		border: 1px solid var(--border);
		font-family: inherit;
		font-size: 0.95rem;
		transition: border-color 0.3s var(--bezier-one);
	}

	.login-input:focus {
		border-color: var(--primary);
		outline: none;
	}

	.login-label {
		position: absolute;
		left: 1rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--surface-six);
		pointer-events: none;
		user-select: none;
		transition: 0.2s ease all;
		background-color: transparent;
		padding: 0 0.25rem;
	}

	.login-input:focus ~ .login-label,
	.login-input:not(:placeholder-shown) ~ .login-label {
		top: 0;
		font-size: 0.8rem;
		color: var(--primary);
		background-color: var(--surface-eight);
	}

	.modal-buttons {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
		width: 100%;
	}

	.status-text {
		color: var(--text-four);
		font-size: 0.85rem;
		margin-right: auto;
	}

	.error-message {
		color: #ff6b6b;
		font-size: 0.9rem;
		margin: 0;
		text-align: center;
		background-color: rgba(255, 107, 107, 0.1);
		padding: 0.5rem;
		border-radius: 0.5rem;
		border: 1px solid rgba(255, 107, 107, 0.2);
	}
</style>
