<script>
	import Navigation from '../atoms/Navigation.svelte';
	import { page } from '$app/stores';
</script>

<div>
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
</div>

<style>
	nav {
		width: 100%;
		position: fixed;
 		top: 0;
		display: flex;
		padding-top: 1.5rem;
		padding-right: 3rem;
		padding-left: 6rem;
		padding-bottom: 1.5rem;
		justify-content: space-between;
		align-items: center;
		min-height: 90px;
		user-select: none;
		background-color: #0f111ab8;
		backdrop-filter: blur(50px);
		background-blend-mode: overlay;
		display: flex;
		z-index: 99;
		margin-bottom: 20rem;
	}


	.logo {
		display: inline-block;
	}

	.logo-image {
		width: 2.9rem;
		cursor: pointer;
		transform: translateY(5%);
	}
	
	h1 {
		display: inline-block;
		margin-left: 1rem;
		font-size: 2.75rem;
		letter-spacing: -0.04em;
	}

	h1 span {
		color: var(--red);
	}


	@media screen and (max-width: 1052px) {

		h1 {
			display: none;
		}

		nav {
			padding-left: 7%;
			padding-right: 1%;
		}
	}

	@media screen and (max-width: 768px) {
		nav {
			background-color: purple;
		}
	}
</style>
