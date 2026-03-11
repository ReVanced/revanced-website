<script lang="ts">
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import { horizontalSlide } from '$lib/utils/horizontalSlide';

	import logo from '$assets/icons/logo.svg';
	import Settings from 'svelte-material-icons/Cog.svelte';
	import SettingsDialog from '$components/organisms/SettingsDialog.svelte';
	import LoginDialog from '$components/organisms/LoginDialog.svelte';
	import { auth } from '$stores';

	type Props = {
		inert?: boolean;
	};

	let { inert = false }: Props = $props();

	const navItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Download', href: '/download' },
		{ label: 'Contributors', href: '/contributors' },
		{ label: 'Donate', href: '/donate' }
	] as const;

	let settingsOpen = $state(false);
	let loginOpen = $state(false);
	let loginFromSettings = $state(false);
	let menuOpen = $state(false);
	let scrollY = $state(0);

	const scrolled = $derived(scrollY > 10);

	$effect(() => {
		page.url.pathname;
		menuOpen = false;
	});

	$effect(() => {
		if (auth.loginModalRequested) {
			loginFromSettings = false;
			loginOpen = true;
			auth.clearLoginModalRequest();
		}
	});

	function handleLoginRequest() {
		settingsOpen = false;
		loginFromSettings = true;
		loginOpen = true;
	}

	function handleLoginClose() {
		loginOpen = false;
		if (loginFromSettings) {
			settingsOpen = true;
			loginFromSettings = false;
		}
	}
</script>

<svelte:window bind:scrollY={scrollY} />

<a class="skip-nav" href="#main-content">Skip navigation</a>

<nav class:scrolled inert={inert ? true : undefined}>
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
			transition:fade={{ duration: 350 }}
		></div>
	{/if}

	{#key menuOpen}
	<div 
		class="nav-drawer" 
		class:open={menuOpen}
		class:desktop-only={!menuOpen}
		transition:horizontalSlide={{ direction: 'inline', easing: expoOut, duration: 400 }}
	>
		<div class="nav-group main-nav">
			{#each navItems as { href, label }}
				<a 
					{href}
					data-sveltekit-preload-data="hover"
					class="rounded nav-button unselectable" 
					class:active={page.url.pathname === href}
				>
					{label}
				</a>
			{/each}
			<a
				href="/announcements"
				data-sveltekit-preload-data="hover"
				class="rounded nav-button unselectable mobile-only"
				class:active={page.url.pathname === '/announcements'}
			>
				Announcements
			</a>
		</div>

		<div class="nav-group secondary-nav">
			<a
				href="/announcements"
				data-sveltekit-preload-data="hover"
				class="rounded nav-button unselectable desktop-only icon-btn"
				class:active={page.url.pathname === '/announcements'}
				aria-label="Announcements"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 -960 960 960"
					width="24px"
					fill="currentColor"
				>
					<path
						d="M720-440v-80h160v80H720Zm48 280-128-96 48-64 128 96-48 64Zm-80-480-48-64 128-96 48 64-128 96ZM200-200v-160h-40q-33 0-56.5-23.5T80-440v-80q0-33 23.5-56.5T160-600h160l200-120v480L320-360h-40v160h-80Zm360-146v-268q27 24 43.5 58.5T620-480q0 41-16.5 75.5T560-346Z"
					/>
				</svg>
			</a>
			<button
				type="button"
				class="rounded nav-button unselectable settings-btn"
				class:selected={settingsOpen}
				onclick={() => (settingsOpen = true)}
			>
				<Settings size={20} color={settingsOpen ? 'var(--primary)' : 'var(--surface-six)'} />
			</button>
		</div>
	</div>
	{/key}
</nav>

<SettingsDialog bind:open={settingsOpen} onLoginRequest={handleLoginRequest} />

<LoginDialog bind:open={loginOpen} onclose={handleLoginClose} />

<style>
	.skip-nav {
		position: absolute;
		top: -100%;
		left: 50%;
		transform: translateX(-50%);
		background-color: var(--primary);
		color: var(--text-three);
		padding: 0.75rem 1.5rem;
		border-radius: 0 0 8px 8px;
		text-decoration: none;
		font-weight: 500;
		z-index: var(--z-top);
		transition: top 0.2s var(--bezier-one);
	}

	.skip-nav:focus {
		top: 0;
		outline: 2px solid var(--text-one);
		outline-offset: 2px;
	}

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
		z-index: var(--z-sticky);
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
		z-index: var(--z-base);
		transition: opacity 0.3s var(--bezier-one);
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
		margin-left: 2rem;
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
		padding: 10px 16px;
		border-radius: 10px;
		transition-timing-function: var(--bezier-one);
		transition-duration: 0.5s;
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

	.secondary-nav .nav-button {
		color: var(--surface-six);
	}

	.secondary-nav .nav-button:hover {
		background-color: var(--surface-three);
		color: var(--text-one);
	}

	.secondary-nav .nav-button.active {
		color: var(--primary);
	}

	.icon-btn {
		color: var(--surface-six);
	}

	.icon-btn:hover {
		color: var(--text-one);
	}

	.icon-btn.active {
		color: var(--primary);
	}

	.icon-btn svg,
	.icon-btn :global(svg) {
		fill: currentColor;
	}

	.settings-btn {
		background: transparent;
		border: none;
		font-family: inherit;
	}

	.settings-btn:hover {
		background-color: var(--surface-three);
	}

	.settings-btn.selected {
		background-color: var(--tertiary);
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
		z-index: var(--z-base);
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
		z-index: 1;
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
			justify-content: normal;
			gap: 2rem;
		}

		.nav-logo {
			position: relative;
			z-index: var(--z-base);
		}

		.nav-logo.hidden {
			display: none !important;
		}

		.menu-btn {
			position: relative;
			z-index: 5;
		}

		.menu-btn.open {
			position: fixed;
			top: 1rem;
			left: 2rem;
			z-index: 5;
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
			z-index: 2;
			flex-direction: column;
			align-items: flex-start;
			padding: 1rem;
			padding-top: 6rem;
			border-radius: 0px 24px 24px 0px;
		}

		.nav-drawer.open {
			display: flex;
		}

		.nav-group {
			flex-direction: column;
			align-items: stretch;
			gap: 0.5rem;
			width: 100%;
		}

		.main-nav {
			margin-left: 0;
		}

		.main-nav .nav-button {
			justify-content: flex-start;
			text-align: left;
			padding: 0.75rem 1.25rem;
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
