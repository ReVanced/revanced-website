<script lang="ts">
	import { browser } from '$app/environment';
	import Modal from '$components/molecules/Modal.svelte';
	import Button from '$components/atoms/Button.svelte';
	import Settings from 'virtual:icons/material-symbols/settings';
	import Reset from 'virtual:icons/material-symbols/refresh';
	import {
		DEFAULT_API_URL,
		getDisplayApiUrl,
		setApiBaseUrl,
		clearCacheAndReload
	} from '$api/settings';
	import { isValidUrl } from '$lib/utils/url';
	import { apiStatus, auth } from '$stores';

	interface Props {
		open: boolean;
		onLoginRequest?: () => void;
	}

	let { open = $bindable(), onLoginRequest }: Props = $props();

	let apiUrl = $state('');
	let urlError = $state('');

	$effect(() => {
		if (open && browser) {
			apiUrl = getDisplayApiUrl();
			urlError = '';
		}
	});

	function formatExpiry(expiry: number | null): string {
		if (!expiry) return '';
		const now = Date.now();
		const diff = expiry - now;
		if (diff <= 0) return 'expired';
		const minutes = Math.floor(diff / (1000 * 60));
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);
		if (days > 0) {
			return `${days} day${days > 1 ? 's' : ''} remaining`;
		}
		if (hours > 0) {
			return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
		}
		return `${minutes} minute${minutes > 1 ? 's' : ''} remaining`;
	}

	let expiryText = $derived(
		auth.isLoggedIn ? `Logged in · ${formatExpiry(auth.expiry)}` : 'Login'
	);

	function handleResetInput() {
		apiUrl = DEFAULT_API_URL;
		urlError = '';
	}

	function handleReset() {
		clearCacheAndReload();
	}

	function handleSave() {
		const trimmedUrl = apiUrl.trim();
		if (trimmedUrl && trimmedUrl !== DEFAULT_API_URL) {
			if (!isValidUrl(trimmedUrl)) {
				urlError = 'Please enter a valid URL';
				return;
			}
		}
		
		urlError = '';
		const urlToSave = trimmedUrl === DEFAULT_API_URL ? undefined : trimmedUrl;
		setApiBaseUrl(urlToSave);
		location.reload();
	}

	function handleLoginClick() {
		onLoginRequest?.();
	}

	function handleLogout() {
		auth.logout();
		open = false;
	}
</script>

<Modal bind:open>
	<div class="settings-content">
		<div class="settings-icon">
			<Settings width="24" height="24" />
		</div>
		<h2 class="settings-title">Settings</h2>
		<p class="settings-description">Configure the API for this website.</p>
		<div class="input-container">
			<input
				type="text"
				class="api-input rounded"
				class:error={urlError}
				placeholder="Enter API URL"
				bind:value={apiUrl}
			/>
			<button
				type="button"
				class="reset-icon-btn"
				onclick={handleResetInput}
				title="Reset to default API URL"
			>
				<Reset width="20" height="20" />
			</button>
		</div>
		{#if urlError}
			<p class="url-error">{urlError}</p>
		{/if}
	</div>
	{#snippet buttons()}
		<div class="modal-buttons">
			{#if auth.isLoggedIn}
				<Button buttonStyle="text" onclick={handleLogout}>
					Logout
				</Button>
				<span class="expiry-text">{expiryText}</span>
			{:else}
				<Button buttonStyle="text" onclick={handleLoginClick} disabled={apiStatus.isOffline}>
					Login
				</Button>
			{/if}
			<div class="right-buttons">
				<Button buttonStyle="text" onclick={handleReset}>
					Reset
				</Button>
				<Button buttonStyle="text" onclick={handleSave}>
					Save
				</Button>
			</div>
		</div>
	{/snippet}
</Modal>

<style>
	.settings-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		width: 100%;
	}

	.settings-icon {
		color: var(--surface-six);
		margin-bottom: 0.1rem;
	}

	.settings-title {
		color: var(--secondary);
		font-weight: 600;
		font-size: 1.25rem;
		margin: 0;
	}

	.settings-description {
		color: var(--text-four);
		font-size: 0.95rem;
		text-align: left;
		align-self: flex-start;
		margin: 0 0 0.5rem 0.5rem;
	}

	.input-container {
		position: relative;
		width: 100%;
		max-width: 400px;
	}

	.api-input {
		width: 100%;
		padding: 0.75rem 3rem 0.75rem 1rem;
		background-color: var(--surface-three);
		color: var(--secondary);
		border: 1px solid var(--border);
		font-family: inherit;
		font-size: 0.95rem;
		transition: border-color 0.3s var(--bezier-one);
	}

	.api-input::placeholder {
		color: #6b7280;
	}

	.api-input:focus {
		border-color: var(--primary);
		outline: none;
	}

	.api-input.error {
		border-color: var(--error, #f44336);
	}

	.url-error {
		color: var(--error, #f44336);
		font-size: 0.85rem;
		margin: 0;
		text-align: center;
	}

	.reset-icon-btn {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
		padding: 0.5rem;
		background-color: transparent;
		color: var(--text-one);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: opacity 0.3s var(--bezier-one);
		border: none;
		border-radius: 6px;
	}

	.reset-icon-btn:hover {
		opacity: 0.6;
	}

	.reset-icon-btn:active {
		opacity: 0.4;
	}

	.modal-buttons {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		max-width: 400px;
	}

	.right-buttons {
		display: flex;
		gap: 0.75rem;
	}

	.expiry-text {
		color: var(--text-four);
		font-size: 0.85rem;
	}
</style>
