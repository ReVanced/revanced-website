<script lang="ts">
	import { page } from '$app/state';
	import logo from '$assets/logo.svg';
	import Notifications from 'virtual:icons/material-symbols/campaign';
	import Settings from 'virtual:icons/material-symbols/settings';
	import Modal from '$components/molecules/Modal.svelte';

	const navItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Download', href: '/download' },
		{ label: 'Patches', href: '/patches' },
		{ label: 'Contributors', href: '/contributors' },
		{ label: 'Donate', href: '/donate' }
	] as const satisfies { label: string; href: string }[];

	let settingsOpen = $state(false);
	let loginOpen = $state(false);
</script>

<nav>
	<div class="nav-group">
		<a href="/" class="nav-item unselectable">
			<img src={logo} alt="ReVanced Logo" class="logo" />
		</a>

		{#each navItems as { href, label }}
			<a {href} class="rounded nav-button unselectable" class:active={page.url.pathname === href}>
				{label}
			</a>
		{/each}
	</div>

	<div class="nav-group">
		<a
			href="/announcements"
			class="rounded nav-button unselectable"
			class:active={page.url.pathname === '/announcements'}><Notifications width="24" height="24" /></a
		>
		<button
			class="rounded nav-button unselectable"
			type="button"
			onclick={() => (settingsOpen = true)}><Settings width="20" height="20" /></button>
	</div>
</nav>

<Modal id="settings" bind:open={settingsOpen}>
	<h2>Settings</h2>
	<p>Configure the API for this website.</p>
	{#snippet buttons()}
		<button type="button" onclick={() => (loginOpen = true)}>Login</button>
	{/snippet}
</Modal>

<Modal id="login" bind:open={loginOpen}>
	<h2>Login</h2>
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

	.nav-group {
		display: flex;
		align-items: stretch;
		justify-content: center;
		gap: 1.5rem;
		height: 100%;
	}

	.nav-item,
	.nav-button {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-item {
		margin-left: 0.5rem;
	}

	.nav-button {
		text-decoration: none;
		color: var(--nav-btn-color);
		font-weight: 500;
		padding: 0.375rem 0.875rem;
		transition: background-color 0.4s, color 1s;

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

		&:not(.active) {
			cursor: pointer;
		}
	}

	.logo {
		height: 22px;
		width: auto;
	}
</style>
