<script lang="ts">
	import { browser } from '$app/environment';
	import Modal from '$components/molecules/Modal.svelte';
	import Button from '$components/atoms/Button.svelte';
	import Settings from 'svelte-material-icons/Cog.svelte';
	import Reset from 'svelte-material-icons/Replay.svelte';
	import {
		DEFAULT_API_URL,
		getDisplayApiUrl,
		setApiBaseUrl,
		clearCacheAndReload
	} from '$api/settings';
	import { isValidUrl } from '$lib/utils';
	import { apiStatus, auth } from '$stores';

	interface Props {
		open: boolean;
		onLoginRequest?: () => void;
	}

	let { open = $bindable(), onLoginRequest }: Props = $props();

	let apiUrl = $state('');
	let urlError = $state('');
	let tick = $state(0);
	let tickInterval: ReturnType<typeof setInterval> | null = null;

	$effect(() => {
		if (open && browser) {
			apiUrl = getDisplayApiUrl();
			urlError = '';
			tickInterval = setInterval(() => {
				tick++;
			}, 1000);
		}
		return () => {
			if (tickInterval) {
				clearInterval(tickInterval);
				tickInterval = null;
			}
		};
	});

	function formatExpiry(expiry: number | null, _tick: number): string {
		if (!expiry) return '';
		const now = Date.now();
		const diff = expiry - now;
		if (diff <= 0) return 'expired';
		const totalSeconds = Math.floor(diff / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);
		if (days > 0) {
			return `${days} day${days > 1 ? 's' : ''} remaining`;
		}
		if (hours > 0) {
			const remainingMinutes = minutes % 60;
			if (remainingMinutes > 0) {
				return `${hours}h ${remainingMinutes}m remaining`;
			}
			return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
		}
		return `${minutes} minute${minutes !== 1 ? 's' : ''} remaining`;
	}

	let expiryText = $derived(
		auth.isLoggedIn ? `Logged in · ${formatExpiry(auth.expiry, tick)}` : 'Login'
	);

	function handleResetInput() {
		apiUrl = DEFAULT_API_URL;
		urlError = '';
	}

	function handleReset() {
		if (auth.isLoggedIn) {
			auth.logout();
		}
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
</script>

<Modal bind:open title="Settings">
	{#snippet icon()}
		<Settings size={24} color="var(--surface-six)" />
	{/snippet}
	<div id="settings-content">
		<p>Configure the API for this website.</p>
		<div class="input-container">
			<input
				type="text"
				class="api-input"
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
				<Reset size={24} color="var(--surface-six)" />
			</button>
		</div>
		{#if urlError}
			<p class="url-error">{urlError}</p>
		{/if}
	</div>
	{#snippet buttons()}
		<div class="modal-buttons">
			{#if auth.isLoggedIn}
				<span class="expiry-text">{expiryText}</span>
			{:else}
				<span title={apiStatus.isOffline ? 'API is offline' : ''}>
					<Button buttonStyle="text" onclick={handleLoginClick} disabled={apiStatus.isOffline}>
						Login
					</Button>
				</span>
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
	#settings-content {
		width: 100%;
	}

	#settings-content p {
		color: var(--text-four);
	}

	.input-container {
		position: relative;
		width: 100%;
		margin-bottom: 0.75rem;
	}

	.api-input {
		width: 100%;
		padding: 1rem;
		padding-right: 3rem;
		margin-top: 1rem;
		background-color: transparent;
		color: var(--secondary);
		border: 1px solid var(--border);
		border-radius: 12px;
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
		right: 12px;
		top: 1rem;
		bottom: 0;
		height: fit-content;
		margin: auto 0;
		padding: 0;
		background-color: transparent;
		color: var(--surface-six);
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
		flex-wrap: wrap;
		gap: 1rem;
		width: 100%;
	}

	.right-buttons {
		display: flex;
		gap: 2rem;
	}

	.expiry-text {
		color: var(--text-four);
		font-size: 0.85rem;
	}
</style>
