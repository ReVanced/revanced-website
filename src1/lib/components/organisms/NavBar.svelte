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


<nav class="nav modern-nav" aria-label="Main navigation">
	<div class="nav-left">
		<a href="/" class="nav-logo unselectable" aria-label="ReVanced home">
			<img src={logo} alt="ReVanced Logo" class="logo" />
		</a>
		<div class="nav-links">
			{#each navItems as { href, label }}
				<a
					{href}
					class="nav-button modern-nav-btn unselectable"
					class:active={page.url.pathname === href}
					aria-current={page.url.pathname === href ? 'page' : undefined}
				>{label}</a>
			{/each}
		</div>
	</div>
	<div class="nav-right">
		<a
			href="/announcements"
			class="nav-button modern-nav-btn icon-btn unselectable"
			class:active={page.url.pathname === '/announcements'}
			aria-label="Announcements"
			aria-current={page.url.pathname === '/announcements' ? 'page' : undefined}
		><Notifications aria-hidden="true" /></a>
		<button
			type="button"
			class="nav-button modern-nav-btn icon-btn unselectable"
			aria-haspopup="dialog"
			aria-controls="settings-modal"
			aria-label="Open settings"
			onclick={() => ui.openSettings()}
		><Settings aria-hidden="true" /></button>
		<button
			type="button"
			class="nav-button modern-nav-btn icon-btn unselectable"
			aria-haspopup="dialog"
			aria-controls="login-modal"
			aria-label="Open login"
			onclick={() => ui.openLogin()}
		><Person aria-hidden="true" /></button>
	</div>
</nav>

<style>
	/* Only keep modern-nav styles, remove legacy .nav and .nav-group styles */

	.modern-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-3) var(--space-5);
		background: rgba(15, 23, 42, 0.65);
		backdrop-filter: blur(16px);
		border-radius: var(--radius-3);
		box-shadow: 0 10px 40px rgba(15, 23, 42, 0.2);
	}

	.nav-left {
		display: flex;
		align-items: center;
		gap: var(--space-8);
	}

	.nav-logo {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 44px;
		width: 44px;
		background: rgba(59, 130, 246, 0.08);
		border-radius: var(--radius-pill);
		box-shadow: 0 2px 8px rgba(59, 130, 246, 0.08);
		margin-right: var(--space-4);
		transition: box-shadow 0.2s;
	}

	.nav-logo:hover {
		box-shadow: 0 4px 16px rgba(59, 130, 246, 0.18);
	}

	.logo {
		height: 28px;
		width: auto;
		display: block;
		border-radius: var(--radius-2);
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

		.modern-nav-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: var(--font-size-md);
			font-weight: var(--font-weight-semibold);
			text-decoration: none;
			color: var(--color-text);
			padding: var(--space-2) var(--space-5);
			border-radius: var(--radius-pill);
			border: 1.5px solid transparent;
			background: transparent;
			transition: background 0.18s, color 0.18s, box-shadow 0.18s;
			position: relative;
		}
		.modern-nav-btn:not(.active):hover,
		.modern-nav-btn:not(.active):focus-visible {
			background: var(--color-accent-hover);
			color: #fff;
			box-shadow: 0 2px 8px rgba(59,130,246,0.15);
			border-color: var(--color-accent-hover);
		}
		.modern-nav-btn.active {
			background: var(--color-accent);
			color: #fff;
			border-color: var(--color-accent);
			box-shadow: 0 2px 8px rgba(59,130,246,0.18);
		}
		.modern-nav-btn:focus-visible {
			outline: 2px solid var(--color-focus-ring);
			outline-offset: 2px;
		}

		.icon-btn {
			padding: var(--space-2);
			width: 40px;
			height: 40px;
			border-radius: var(--radius-pill);
			background: transparent;
			font-size: 1.25rem;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: background 0.18s, box-shadow 0.18s;
		}
		.icon-btn:hover,
		.icon-btn:focus-visible {
			background: var(--color-accent-hover);
			color: #fff;
			box-shadow: 0 2px 8px rgba(59,130,246,0.15);
		}
		.icon-btn.active {
			background: var(--color-accent);
			color: #fff;
			box-shadow: 0 2px 8px rgba(59,130,246,0.18);
		}

		.nav-right {
			display: flex;
			align-items: center;
			gap: var(--space-2);
		}

	@media (max-width: 700px) {
		.modern-nav {
			padding: var(--space-2) var(--space-2);
			height: 56px;
		}
		.nav-logo {
			height: 32px;
			width: 32px;
		}
		.logo {
			height: 18px;
		}
		.modern-nav-btn {
			font-size: var(--font-size-sm);
			padding: var(--space-1) var(--space-3);
		}
		.icon-btn {
			width: 32px;
			height: 32px;
		}
	}
</style>