<script lang="ts">
	import { page } from '$app/state';
	import logo from '$assets/logo.svg';
	import Notifications from 'virtual:icons/material-symbols/notifications-outline';
	import Settings from 'virtual:icons/material-symbols/settings-outline';
	import { ui } from '$stores/ui.svelte';
	import Person from 'virtual:icons/material-symbols/person-outline';

	const navItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Download', href: '/download' },
		{ label: 'Patches', href: '/patches' },
		{ label: 'Contributors', href: '/contributors' },
		{ label: 'Donate', href: '/donate' }
	] as const satisfies { label: string; href: string }[];
</script>

<nav class="nav" aria-label="Main navigation">
	<div class="nav-group">
		<a href="/" class="nav-item unselectable" aria-label="ReVanced home">
			<img src={logo} alt="ReVanced Logo" class="logo" />
		</a>

		{#each navItems as { href, label }}
			<a
				{href}
				class="nav-button rounded unselectable"
				class:active={page.url.pathname === href}
				aria-current={page.url.pathname === href ? 'page' : undefined}
			>{label}</a>
		{/each}
	</div>

	<div class="nav-group">
		<a
			href="/announcements"
			class="nav-button rounded unselectable"
			class:active={page.url.pathname === '/announcements'}
			aria-label="Announcements"
			aria-current={page.url.pathname === '/announcements' ? 'page' : undefined}
		><Notifications aria-hidden="true" /></a>
		<button
			type="button"
			class="nav-button rounded unselectable"
			aria-haspopup="dialog"
			aria-controls="settings-modal"
			aria-label="Open settings"
			onclick={() => ui.openSettings()}
		><Settings aria-hidden="true" /></button>
		<button
			type="button"
			class="nav-button rounded unselectable"
			aria-haspopup="dialog"
			aria-controls="login-modal"
			aria-label="Open login"
			onclick={() => ui.openLogin()}
		><Person aria-hidden="true" /></button>
	</div>
</nav>

<style>
	.nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-3) var(--space-6);
		height: 70px;
		position: sticky;
		top: 0;
		left: 0;
		z-index: var(--z-nav);
		background: var(--color-bg);
		border-bottom: 1px solid var(--color-border);
	}

	.nav-group {
		display: flex;
		align-items: stretch;
		justify-content: center;
		gap: var(--space-4);
		height: 100%;
	}

	.nav-item,
	.nav-button {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		text-decoration: none;
		color: var(--color-text);
		padding: var(--space-2) var(--space-3);
		transition: background-color .18s ease, color .18s ease;
		border: 1px solid transparent;
	}

	.nav-button:not(.active):hover,
	.nav-button:not(.active):focus-visible {
		background: var(--color-accent-hover);
		color: #fff;
		box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
		transition: background 0.2s, color 0.2s, box-shadow 0.2s;
	}
	.nav-button.active {
		background: var(--color-accent);
		color: var(--color-neutral-0);
		box-shadow: none;
	}
	.nav-button:focus-visible {
		outline: 2px solid var(--color-focus-ring);
		outline-offset: 2px;
	}

	.logo { height: 22px; width: auto; display: block; }

	@media (prefers-color-scheme: dark) {
		.nav { background: var(--color-bg-alt); }
	}
</style>