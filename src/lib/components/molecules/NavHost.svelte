<script lang="ts">
	import Navigation from '../atoms/NavButton.svelte';
	import { page } from '$app/stores';
	import MobileDropdown from './MobileDropdown.svelte';
	import { onMount } from 'svelte';
	import RouterEvents from '../../../data/RouterEvents';
	import ApiSettingsButton from '$lib/components/atoms/ApiSettingsButton.svelte';

	let menuOpen = false;

	onMount(() => {
		return RouterEvents.subscribe((event) => {
			if (event.navigating) {
				menuOpen = false;
			}
		});
	});
</script>

<nav>
	<div class="navbar">
		<div class="left-side">
			<a href="/">
				<span class="logo">
					<img src="/logo.svg" class="logo-image" alt="ReVanced Logo" />
				</span>
			</a>
			<span class="desktop">
				<Navigation href="/">Home</Navigation>
				<Navigation href="/download">Download</Navigation>
				<div hidden>
					<!-- This is just temporary so the build doesn't fail -->
					<Navigation is_selected={(target) => target.startsWith('/docs')} href="/docs"
						>Docs</Navigation
					>
				</div>
				<Navigation href="/patches">Patches</Navigation>
			</span>
		</div>

		<div class="right-side">
			<span class="desktop">
				<Navigation href="/contributors/">
					<img src="/icons/contrib.svg" alt="Contributors" />
				</Navigation>
				<ApiSettingsButton />
			</span>

			<!-- Should probably be moved to its own component. -->
			<button
				class="menu-btn button-reset mobile"
				class:open={menuOpen}
				on:click={() => {
					menuOpen = !menuOpen;
				}}
			>
				<span class="menu-btn__burger" />
			</button>
		</div>
	</div>

	<div class="mobile">
		{#if menuOpen}
			<MobileDropdown>
				<div class="mobile-menu">
					<div>
						<Navigation href="/">Home</Navigation>
						<Navigation href="/download">Download</Navigation>
						<Navigation href="/patches">Patches</Navigation>
					</div>

					<div class="bottom-mobile-container">
						<Navigation href="/contributors/">
							<img src="/icons/contrib.svg" alt="Contributors" />
						</Navigation>
						<ApiSettingsButton on:click={() => {
							menuOpen = false;
						}}/>
					</div>
				</div>
			</MobileDropdown>
		{/if}
	</div>
</nav>

<style>
	nav {
		position: fixed;
		width: 100vw;
		top: 0;
		left: 0;
		z-index: 999;
		border-bottom: 0.5px solid var(--grey-three);
	}
	.navbar {
		padding: 0 1rem 0 2rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 70px;
		width: 100%;
		z-index: 999;
		background-color: var(--grey-six);
	}

	.desktop {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.mobile-menu {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 85vw;
		height: calc(100vh - 70px);
		white-space: pre;
		padding: 2rem 0;
		margin: 0 auto;
		justify-content: space-between;
	}

	a {
		text-decoration: none;
	}

	.logo-image {
		height: 1.75rem;
		width: auto;
		cursor: pointer;
	}

	.logo {
		display: flex;
		align-items: center;
	}

	.left-side {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 2.5rem;
	}

	img {
		height: 20px;
	}

	@media screen and (max-width: 768px) {
		.desktop {
			display: none;
		}

		img {
			height: 25px;
		}
	}

	.bottom-mobile-container {
		display: flex;
		float: bottom;
	}

	/* Hamburger mmm yum */
	@media screen and (min-width: 768px) {
		.mobile {
			display: none !important;
		}
	}

	.menu-btn {
		user-select: none;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 80px;
		height: 60px;
		cursor: pointer;
		transition: all 0.5s var(--bezier-one);
	}

	.menu-btn__burger {
		width: 25px;
		height: 2px;
		border-radius: 50px;
		background: var(--grey-five);
		transition: all 0.5s var(--bezier-one);

		display: flex;
		flex-wrap: wrap;
	}
	.menu-btn__burger::before,
	.menu-btn__burger::after {
		content: '';
		position: absolute;
		width: 25px;
		height: 2px;
		border-radius: 50px;
		background: var(--grey-five);
		transition: all 0.5s var(--bezier-one);
	}
	.menu-btn__burger::before {
		transform: translateY(-8px);
	}
	.menu-btn__burger::after {
		transform: translateY(8px);
	}
	/* ANIMATION */
	.menu-btn.open .menu-btn__burger {
		transform: translateX(-20px);
		background: transparent;
		box-shadow: none;
	}
	.menu-btn.open .menu-btn__burger::before {
		transform: rotate(45deg) translate(15px, -15px);
	}
	.menu-btn.open .menu-btn__burger::after {
		transform: rotate(-45deg) translate(15px, 15px);
	}
</style>
