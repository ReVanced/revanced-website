<script lang="ts">
	import { page } from '$app/state';

	import logo from '$assets/icons/logo.svg';
	import Notifications from 'virtual:icons/material-symbols/campaign';
	import Settings from 'virtual:icons/material-symbols/settings';
	import SettingsDialog from '$components/molecules/SettingsDialog.svelte';
	import LoginDialog from '$components/molecules/LoginDialog.svelte';
	import { auth } from '$stores';
	import {
		aboutQuery,
		announcementsQuery,
		contributorsQuery,
		managerQuery,
		patchesQuery,
		teamQuery
	} from '$stores';

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
	let scrollY = $state(0);

	const scrolled = $derived(scrollY > 10);

	$effect(() => {
		page.url.pathname;
		menuOpen = false;
	});

	$effect(() => {
		if (auth.loginModalRequested) {
			loginOpen = true;
			auth.clearLoginModalRequest();
		}
	});

	function handleLoginRequest() {
		loginOpen = true;
	}

	function prefetchRoute(href: string) {
		if (href === '/download') {
			managerQuery.refetch();
		} else if (href === '/patches') {
			patchesQuery.refetch();
		} else if (href === '/announcements') {
			announcementsQuery.refetch();
		} else if (href === '/contributors') {
			contributorsQuery.refetch();
		} else if (href === '/donate') {
			aboutQuery.refetch();
			teamQuery.refetch();
		}
	}
</script>

<svelte:window bind:scrollY={scrollY} />

<nav class:scrolled>
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
	<a href="/" class="nav-logo unselectable" class:hidden={menuOpen}>
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
				<a 
					{href} 
					class="rounded nav-button unselectable" 
					class:active={page.url.pathname === href}
					onmouseenter={() => prefetchRoute(href)}
				>
					{label}
				</a>
			{/each}
			<a
				href="/announcements"
				class="rounded nav-button unselectable mobile-only"
				class:active={page.url.pathname === '/announcements'}
				onmouseenter={() => prefetchRoute('/announcements')}
			>
				Announcements
			</a>
		</div>

		<div class="nav-group secondary-nav">
			<a
				href="/announcements"
				class="rounded nav-button unselectable desktop-only"
				class:active={page.url.pathname === '/announcements'}
				onmouseenter={() => prefetchRoute('/announcements')}
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

<SettingsDialog bind:open={settingsOpen} onLoginRequest={handleLoginRequest} />

<LoginDialog bind:open={loginOpen} />

<style>
	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 2rem;
		height: 70px;
		width: 100%;
		position: sticky;
		top: 0;
		left: 0;
		z-index: 9996;
		background-color: var(--surface-eight);
		transition: box-shadow 0.3s var(--bezier-one);
	}

	nav.scrolled {
		box-shadow: var(--drop-shadow-one);
	}

	.nav-logo {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		z-index: 6;
		transition: opacity 0.3s var(--bezier-one);
		margin-left: 4rem;
	}

	.nav-logo.hidden {
		opacity: 0;
		pointer-events: none;
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
		gap: 1rem;
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
		color: var(--text-four);
		font-weight: 400;
		font-size: 0.9rem;
		letter-spacing: 0.02rem;
		padding: 0.625rem 1rem;
		border-radius: 10px;
		transition-timing-function: var(--bezier-one);
		transition-duration: 0.25s;
		transition-property: background-color, color;
		cursor: pointer;
		user-select: none;
		list-style: none;

		&:hover {
			background-color: var(--surface-three);
			color: var(--text-one);
		}

		&.active {
			color: var(--primary);
			background-color: var(--tertiary);
			pointer-events: none;
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
		background: var(--surface-six);
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
			gap: 2rem;
		}

		.nav-logo {
			position: relative;
			z-index: 1;
		}

		.nav-logo.hidden {
			display: none !important;
		}

		.menu-btn {
			position: fixed;
			top: 10px;
			left: 2rem;
			z-index: 6;
		}

		.nav-drawer {
			overflow-y: auto;
			overflow-x: hidden;
			position: fixed;
			width: 20rem;
			max-width: 85vw;
			top: 0;
			left: 0;
			height: 100%;
			background-color: var(--surface-eight);
			z-index: 4;
			flex-direction: column;
			align-items: flex-start;
			padding: 6rem 1rem 1rem;
			transform: translateX(-100%);
			transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
			border-radius: 0px 24px 24px 0px;
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
			padding: 0.75rem 1.25rem;
			text-align: left;
			font-size: 1rem;
			font-weight: 500;
		}

		.secondary-nav {
			margin-top: auto;
			padding: 1rem;
			flex-direction: row;
			gap: 1rem;
			align-self: flex-start;
		}

		.settings-btn {
			width: auto;
			padding: 0.625rem 1rem;
		}
	}
</style>
