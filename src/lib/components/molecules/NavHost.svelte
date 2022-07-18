<script>
	import Navigation from '../atoms/Navigation.svelte';
</script>

<nav>
	<img class="logo" src="/logo.svg" alt="ReVanced Logo"/>
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
		padding-right: 2rem;
		padding-left: 6rem;
		justify-content: space-between;
		align-items: center;
        min-height: 90px;
	}
	.logo {
		width: 3rem;
	}

</style>
