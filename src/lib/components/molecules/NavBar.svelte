<script lang="ts">
	import { page } from '$app/state';
	import logo from '$assets/logo.svg';
	import Announcement from 'virtual:icons/mdi/announcement';
	import Gear from 'virtual:icons/mdi/gear';

	const navItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Download', href: '/download' },
		{ label: 'Patches', href: '/patches' },
		{ label: 'Contributors', href: '/contributors' },
		{ label: 'Donate', href: '/donate' }
	] as const satisfies { label: string; href: string }[];
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
		<a href="/announcements" class="rounded nav-button unselectable"><Announcement /></a>
		<button class="rounded nav-button unselectable" type="button"><Gear /></button>
	</div>
</nav>

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
		z-index: 9999;
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

	.nav-button {
		text-decoration: none;
		color: #333;
		font-weight: 500;
		padding: 0.5rem 1rem;
		transition: background-color 0.2s;
		background-color: transparent;

		&:hover {
			background-color: #e0e0e0;
		}

		&.active {
			color: #fff;
			background-color: #333;
		}
	}

	.logo {
		height: 22px;
		width: auto;
	}
</style>
