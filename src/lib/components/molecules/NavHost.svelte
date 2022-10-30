<script lang="ts">
	import Navigation from '../atoms/NavButton.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let menuBtn: HTMLElement;
	let menuOpen = false;
	onMount(() => {
		menuBtn.addEventListener('click', () => {
			if (!menuOpen) {
				menuBtn.classList.add('open');
				menuOpen = true;
			} else {
				menuBtn.classList.remove('open');
				menuOpen = false;
			}
		});
	});
</script>

<nav>
	<a href="/">
		<div class="logo">
			<img src="/logo.svg" class="logo-image" alt="ReVanced Logo" />
			{#if $page.url.pathname !== '/'}
				<h1><span>Re</span>Vanced</h1>
			{/if}
		</div>
	</a>
	<ul>
		<Navigation href="/">Home</Navigation>
		<Navigation href="/download/">Download</Navigation>
		<Navigation href="/docs/">Docs</Navigation>
		<Navigation href="/patches/">Patches</Navigation>
		<Navigation href="/credits/">Credits</Navigation>
		<Navigation href="/api-settings/">API Settings</Navigation>
	</ul>
	<div class="menu-btn" class:open={menuOpen} bind:this={menuBtn}>
		<div class="menu-btn__burger" />
	</div>
</nav>

<style>
	nav {
		padding: 0 1rem 0 2rem;
		top: 0;
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 70px;
		width: 100%;
		z-index: 999;
		background-color: var(--grey-six);
		backdrop-filter: blur(15px);
		-webkit-backdrop-filter: blur(15px);
	}

	ul {
		display: flex;
		gap: 0.75rem;
		align-items: center;
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

	h1 {
		display: inline-block;
		margin-left: 1rem;
		font-size: 1.75rem;
		letter-spacing: -0.04em;
		height: 90%;
	}

	h1 span {
		color: var(--accent-color);
	}

	@media screen and (max-width: 400px) {
		h1 {
			display: none;
		}
	}

	@media screen and (max-width: 768px) {
		ul {
			display: none;
		}
	}

	/* Hamburger mmm yum */
	@media screen and (min-width: 768px) {
		.menu-btn {
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
		transition: all 0.5s ease-in-out;
		background: var(--grey-one);
		border-radius: 3rem;
	}
	.menu-btn__burger {
		width: 30px;
		height: 3px;
		background: #fff;
		border-radius: 5px;
		transition: all 0.5s ease-in-out;
	}
	.menu-btn__burger::before,
	.menu-btn__burger::after {
		content: '';
		position: absolute;
		width: 30px;
		height: 3px;
		background: #fff;
		border-radius: 5px;
		transition: all 0.5s ease-in-out;
	}
	.menu-btn__burger::before {
		transform: translateY(-8px);
	}
	.menu-btn__burger::after {
		transform: translateY(8px);
	}
	/* ANIMATION */
	.menu-btn.open .menu-btn__burger {
		transform: translateX(-50px);
		background: transparent;
		box-shadow: none;
	}
	.menu-btn.open .menu-btn__burger::before {
		transform: rotate(45deg) translate(35px, -35px);
	}
	.menu-btn.open .menu-btn__burger::after {
		transform: rotate(-45deg) translate(35px, 35px);
	}
</style>
