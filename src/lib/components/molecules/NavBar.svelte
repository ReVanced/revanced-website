<script lang="ts">
	import { page } from '$app/state';

	const navItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Download', href: '/download' },
		{ label: 'Patches', href: '/patches' },
		{ label: 'Contributors', href: '/contributors' },
		{ label: 'Donate', href: '/donate' }
	] as const satisfies { label: string; href: string }[];
</script>

<nav>
	<ul>
		{#each navItems as { href, label }}
			<li>
				<a {href} class:active={page.url.pathname === href}>
					{label}
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	nav {
		padding: 1rem;
		background: #f5f5f5;
		border-bottom: 1px solid #ddd;
	}

	ul {
		display: flex;
		gap: 1.5rem;
		list-style: none;
		max-width: 1200px;
		margin: 0 auto;
	}

	a {
		text-decoration: none;
		color: #333;
		font-weight: 500;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	a:hover {
		background-color: #e0e0e0;
	}

	a.active {
		color: #fff;
		background-color: #333;
	}
</style>
