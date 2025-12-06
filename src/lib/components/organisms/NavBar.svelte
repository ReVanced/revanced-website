<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/environment';

	import logo from '$assets/icons/logo.svg';
	import Notifications from 'virtual:icons/material-symbols/campaign';
	import Settings from 'virtual:icons/material-symbols/settings';
	import Reset from 'virtual:icons/material-symbols/refresh';
	import Modal from '$components/molecules/Modal.svelte';
	import Button from '$components/atoms/Button.svelte';
	import {
		DEFAULT_API_URL,
		getDisplayApiUrl,
		setApiBaseUrl,
		clearCacheAndReload
	} from '$api/settings';
	import { apiStatus } from '$stores';

	const navItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Download', href: '/download' },
		{ label: 'Patches', href: '/patches' },
		{ label: 'Contributors', href: '/contributors' },
		{ label: 'Donate', href: '/donate' }
	] as const satisfies { label: string; href: string }[];

	let settingsOpen = $state(false);
	let loginOpen = $state(false);
	let menuOpen = $state(false);
	let apiUrl = $state('');
	let username = $state('');
	let password = $state('');
	let loginError = $state('');

	$effect(() => {
		page.url.pathname;
		menuOpen = false;
	});

	$effect(() => {
		if (settingsOpen && browser) {
			apiUrl = getDisplayApiUrl();
		}
	});

	function handleResetInput() {
		apiUrl = DEFAULT_API_URL;
	}

	function handleReset() {
		clearCacheAndReload();
	}

	function handleSave() {
		const urlToSave = apiUrl.trim() === DEFAULT_API_URL ? undefined : apiUrl.trim();
		setApiBaseUrl(urlToSave);
		location.reload();
	}

	function handleLogin() {
		loginOpen = true;
	}

	function handleCancelLogin() {
		loginOpen = false;
		username = '';
		password = '';
		loginError = '';
	}

	function handleLoginSubmit() {
		if (!username || !password) {
			loginError = 'Username and password are required';
			return;
		}
		loginError = '';
		console.log('Login with:', username, password);
		loginOpen = false;
		username = '';
		password = '';
	}
</script>

<nav>
	<button
		type="button"
		class="menu-btn mobile-only"
		class:open={menuOpen}
		onclick={() => (menuOpen = !menuOpen)}
		aria-label="Menu"
	>
		<span class="menu-btn__burger"></span>
	</button>

	<!-- Logo -->
	<a href="/" class="nav-logo unselectable">
		<img src={logo} alt="ReVanced Logo" class="logo" />
	</a>

	{#if menuOpen}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="overlay mobile-only"
			role="button"
			tabindex="-1"
			aria-label="Close menu"
			onclick={() => (menuOpen = false)}
			onkeydown={(e) => e.key === 'Enter' && (menuOpen = false)}
		></div>
	{/if}

	<div class="nav-drawer" class:open={menuOpen}>
		<div class="nav-group main-nav">
			{#each navItems as { href, label }}
				<a {href} class="rounded nav-button unselectable" class:active={page.url.pathname === href}>
					{label}
				</a>
			{/each}
			<a
				href="/announcements"
				class="rounded nav-button unselectable mobile-only"
				class:active={page.url.pathname === '/announcements'}
			>
				Announcements
			</a>
		</div>

		<div class="nav-group secondary-nav">
			<a
				href="/announcements"
				class="rounded nav-button unselectable desktop-only"
				class:active={page.url.pathname === '/announcements'}
			>
				<Notifications width="24" height="24" />
			</a>
			<button
				type="button"
				class="rounded nav-button unselectable settings-btn"
				onclick={() => (settingsOpen = true)}
			>
				<Settings width="24" height="24" />
			</button>
		</div>
	</div>
</nav>

<Modal id="settings" bind:open={settingsOpen}>
	<div class="modal-content settings-content">
		<div class="settings-icon">
			<Settings width="24" height="24" />
		</div>
		<h2 class="modal-title settings-title">Settings</h2>
		<p class="modal-description settings-description">Configure the API for this website.</p>
		<div class="input-container">
			<input
				type="text"
				class="modal-input api-input rounded"
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
	</div>
	{#snippet buttons()}
		<div class="modal-buttons">
			<Button buttonStyle="text" type="button" class="modal-btn login-btn rounded" onclick={handleLogin} disabled={apiStatus.isOffline}>
				Login
			</Button>
			<div class="right-buttons">
				<Button buttonStyle="text" type="button" class="modal-btn rounded" onclick={handleReset}>
					Reset
				</Button>
				<Button buttonStyle="text" type="button" class="modal-btn rounded" onclick={handleSave}>
					Save
				</Button>
			</div>
		</div>
	{/snippet}
</Modal>

<Modal id="login" bind:open={loginOpen}>
	<div class="modal-content login-content">
		<h2 class="modal-title login-title">Login</h2>
		<p class="modal-description">This login is reserved for site administrators. Go back!</p>

		<div class="login-form">
			<div class="input-group">
				<input
					type="text"
					id="username"
					bind:value={username}
					placeholder=" "
					class="modal-input rounded"
				/>
				<label for="username" class="login-label">Username</label>
			</div>
			<div class="input-group">
				<input
					type="password"
					id="password"
					bind:value={password}
					placeholder=" "
					class="modal-input rounded"
				/>
				<label for="password" class="login-label">Password</label>
			</div>
			{#if loginError}
				<p class="error-message">{loginError}</p>
			{/if}
		</div>
	</div>
	{#snippet buttons()}
		<div class="modal-buttons login-buttons">
			<div class="right-buttons">
				<Button buttonStyle="text" type="button" class="modal-btn rounded" onclick={handleCancelLogin}>
					Cancel
				</Button>
				<Button buttonStyle="text" type="button" class="modal-btn rounded" onclick={handleLoginSubmit}>
					Login
				</Button>
			</div>
		</div>
	{/snippet}
</Modal>

<style>
	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 2rem;
		height: 70px;
		position: sticky;
		top: 0;
		left: 0;
		z-index: 9997;
		background-color: var(--nav-bg);
	}

	.nav-logo {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		z-index: 6;
	}

	.nav-drawer {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: center;
	}

	.nav-group {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.main-nav {
		margin-left: 1rem;
	}

	.nav-button,
	nav :global(.nav-button) {
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		color: var(--nav-btn-color);
		font-weight: 500;
		padding: 0.375rem 0.875rem;
		transition: background-color 0.4s, color 1s;
		cursor: pointer;

		&:hover {
			background-color: var(--nav-btn-hover-bg);
			color: var(--nav-btn-hover-color);
		}

		&:active {
			background-color: var(--nav-btn-active-bg);
			color: var(--nav-btn-active-color);
		}

		&.active {
			color: var(--nav-btn-active-color);
			background-color: var(--nav-btn-active-bg);
			transition: background-color 0.3s, color 0.3s;
			cursor: default;
		}
	}

	.settings-btn {
		background: transparent;
		border: none;
		font-family: inherit;
	}

	.logo {
		height: 22px;
		width: auto;
	}

	.menu-btn {
		user-select: none;
		position: relative;
		display: flex;
		height: 50px;
		z-index: 6;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		background: transparent;
		border: none;
	}

	.menu-btn__burger {
		display: flex;
		flex-wrap: wrap;
	}

	.menu-btn__burger,
	.menu-btn__burger::before,
	.menu-btn__burger::after {
		width: 24px;
		height: 2px;
		background: var(--nav-btn-color);
		transition: all 0.3s var(--bezier-one);
	}

	.menu-btn__burger::before,
	.menu-btn__burger::after {
		content: '';
		position: absolute;
	}

	.menu-btn__burger::before {
		transform: translateY(-6.5px);
	}

	.menu-btn__burger::after {
		transform: translateY(6.5px);
	}

	.menu-btn.open .menu-btn__burger {
		transform: translateX(-10px);
		background: transparent;
		box-shadow: none;
	}

	.menu-btn.open .menu-btn__burger::before {
		transform: rotate(45deg) translate(10px, -10px);
	}

	.menu-btn.open .menu-btn__burger::after {
		transform: rotate(-45deg) translate(10px, 10px);
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 3;
	}

	.mobile-only {
		display: none !important;
	}

	.desktop-only {
		display: flex !important;
	}

	@media (max-width: 768px) {
		.mobile-only {
			display: flex !important;
		}

		.desktop-only {
			display: none !important;
		}

		nav {
			justify-content: flex-start;
			gap: 0.5rem;
		}

		.nav-drawer {
			overflow: hidden;
			position: fixed;
			width: 20rem;
			max-width: 85vw;
			top: 0;
			left: 0;
			height: 100%;
			background-color: var(--nav-bg);
			z-index: 4;
			flex-direction: column;
			align-items: flex-start;
			padding: 6rem 1rem 1rem;
			transform: translateX(-100%);
			transition: transform 0.3s ease-out;
		}

		.nav-drawer.open {
			transform: translateX(0);
		}

		.nav-group {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
			width: 100%;
		}

		.main-nav {
			margin-left: 0;
		}

		.nav-button {
			width: 100%;
			justify-content: flex-start;
			padding: 0.75rem 1rem;
		}

		.secondary-nav {
			margin-top: auto;
			padding: 1rem 0;
			flex-direction: row;
			gap: 1rem;
		}
	}

	.modal-content {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.modal-title {
		color: var(--settings-title-color);
		font-weight: 600;
		margin: 0;
	}

	.modal-description {
		color: var(--nav-btn-color);
		font-size: 0.95rem;
		margin: 0;
	}

	.modal-input {
		width: 100%;
		padding: 0.75rem 1rem;
		background-color: var(--nav-btn-hover-bg);
		color: var(--nav-btn-hover-color);
		border: 1px solid #3a4149;
		font-family: inherit;
		font-size: 0.95rem;
		transition: border-color 0.3s;

		&:focus {
			border-color: var(--nav-btn-active-color);
			outline: none;
		}
	}

	.settings-content {
		align-items: center;
		gap: 1rem;
	}

	.settings-icon {
		color: var(--settings-icon-color);
		margin-bottom: 0.1rem;
	}

	.settings-title {
		font-size: 1.25rem;
	}

	.settings-description {
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
		padding: 0.75rem 3rem 0.75rem 1rem;

		&::placeholder {
			color: #6b7280;
		}
	}

	.input-container :global(.reset-button),
	.reset-icon-btn {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
		padding: 0.5rem;
		background-color: transparent;
		color: var(--settings-title-color);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: opacity 0.3s;
		border: none;
		border-radius: 6px;

		&:hover:not(:disabled) {
			opacity: 0.6;
		}

		&:active:not(:disabled) {
			opacity: 0.4;
		}

		&:disabled {
			cursor: default;
		}
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

	.modal-buttons :global(.modal-btn) {
		padding: 0.5rem 0.75rem;
		background-color: transparent;
		color: var(--settings-title-color);
		font-family: inherit;
		font-size: 0.95rem;
		font-weight: 500;
		cursor: pointer;
		transition: color 0.3s, opacity 0.3s;
		border: none;

		&:hover {
			color: #c5e0f7;
			opacity: 0.8;
		}

		&:active {
			opacity: 0.6;
		}
	}

	.login-content {
		align-items: center;
		gap: 1.5rem;
	}

	.login-title {
		font-size: 2.5rem;
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

	.login-label {
		position: absolute;
		left: 1rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--nav-btn-color);
		pointer-events: none;
		user-select: none;
		transition: 0.2s ease all;
		background-color: transparent;
		padding: 0 0.25rem;
	}

	.modal-input:focus ~ .login-label,
	.modal-input:not(:placeholder-shown) ~ .login-label {
		top: 0;
		font-size: 0.8rem;
		color: var(--nav-btn-active-color);
		background-color: #1e1f24;
	}

	.login-buttons {
		justify-content: flex-end;
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
