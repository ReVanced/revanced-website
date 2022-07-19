<script>
	import Navigation from '../atoms/Navigation.svelte';
	import { page } from '$app/stores';
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
		<Navigation href="/download">Download</Navigation>
		<Navigation href="/docs">Docs</Navigation>
		<Navigation href="/credits">Credits</Navigation>
	</ul>
</nav>

<style>
	nav {
		width: 100%;
		display: flex;
		padding-top: 1.25rem;
		padding-right: 3rem;
		padding-left: 6rem;
		justify-content: space-between;
		align-items: center;
		min-height: 90px;
		user-select: none;
	}

	.logo {
		display: inline-block;
	}

	.logo-image {
		width: 2.9rem;
		cursor: pointer;
	}
	
	h1 {
		display: inline-block;
		margin-left: 1rem;
		font-size: 2.75rem;
		letter-spacing: -0.04em;
		transform: translateY(-5%);
	}

	h1 span {
		color: var(--red);
	}
</style>
