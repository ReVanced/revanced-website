<script>
	import Navigation from '../atoms/Navigation.svelte';
</script>

<nav>
	<div class="logo">ReVanced</div>
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
		padding-right: 4rem;
		justify-content: space-between;
		align-items: center;
        min-height: 83px;
	}
</style>
