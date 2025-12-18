<script lang="ts">
	import Modal from '$components/molecules/Modal.svelte';
	import Button from '$components/atoms/Button.svelte';
	import { auth } from '$stores';

	interface Props {
		open: boolean;
	}

	let { open = $bindable() }: Props = $props();

	let loginForm: HTMLFormElement | undefined = $state();
	let username = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	function handleCancel() {
		open = false;
		username = '';
		password = '';
		error = '';
	}

	async function handleFormSubmit(event: SubmitEvent) {
		event.preventDefault();

		error = '';
		loading = true;

		const result = await auth.login(username, password);

		loading = false;

		if (result.success) {
			open = false;
			username = '';
			password = '';
		} else {
			error = result.error;
		}
	}

	function handleLoginClick() {
		loginForm?.requestSubmit();
	}

	function handlePasswordKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !loading) {
			loginForm?.requestSubmit();
		}
	}
</script>

<Modal bind:open>
	<div class="login-content">
		<h2 class="login-title">Login</h2>
		<p class="login-description">This login is reserved for site administrators. Go back!</p>

		{#if error}
			<p class="error-message">{error}</p>
		{/if}

		<form class="login-form" bind:this={loginForm} onsubmit={handleFormSubmit}>
			<div class="input-group">
				<input
					type="text"
					id="login-username"
					name="username"
					autocomplete="username"
					bind:value={username}
					placeholder=" "
					class="login-input rounded"
					disabled={loading}
					required
				/>
				<label for="login-username" class="login-label">Username</label>
			</div>
			<div class="input-group">
				<input
					type="password"
					id="login-password"
					name="password"
					autocomplete="current-password"
					bind:value={password}
					placeholder=" "
					class="login-input rounded"
					disabled={loading}
					onkeydown={handlePasswordKeydown}
					required
				/>
				<label for="login-password" class="login-label">Password</label>
			</div>
		</form>
	</div>
	{#snippet buttons()}
		<div class="login-buttons">
			<Button buttonStyle="text" onclick={handleCancel} disabled={loading}>
				Cancel
			</Button>
			<Button buttonStyle="text" onclick={handleLoginClick} disabled={loading}>
				{loading ? 'Logging in...' : 'Login'}
			</Button>
		</div>
	{/snippet}
</Modal>

<style>
	.login-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		width: 100%;
	}

	.login-title {
		font-size: 2.5rem;
		color: var(--primary);
		font-weight: 600;
		margin: 0;
	}

	.login-description {
		color: var(--text-four);
		font-size: 0.95rem;
		margin: 0;
		text-align: center;
	}

	.login-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		margin-top: 0.5rem;
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

	.login-buttons {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		width: 100%;
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
