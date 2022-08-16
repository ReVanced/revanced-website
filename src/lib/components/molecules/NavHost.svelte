<script lang="ts">
	import Navigation from '../atoms/Navigation.svelte';
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

<div class="wrapper">
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
			<Navigation href="/download">Download</Navigation>
			<Navigation href="/docs">Docs</Navigation>
			<Navigation href="/credits">Credits</Navigation>
		</ul>
		<div class="menu-btn" class:open={menuOpen} bind:this={menuBtn}>
			<div class="menu-btn__burger" />
		</div>
	</nav>
</div>

<style>
	nav {
		top: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 90px;
		width: 100%;
	}

	ul {
		display: flex;
		gap:0.75rem;
		align-items: center;
	}

	.logo {
		display: flex;
	}

	a {
		text-decoration: none;
	}
	.logo-image {
		width: 2.9rem;
		cursor: pointer;
	}

	h1 {
		display: inline-block;
		margin-left: 1rem;
		font-size: 2.4rem;
		letter-spacing: -0.04em;
		height:90%;
	}

	h1 span {
		color: var(--red);
	}

	@media screen and (max-width: 1052px) {
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
