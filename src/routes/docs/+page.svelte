<script>
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import Button from '$lib/components/atoms/Button.svelte';
</script>

<main in:fly={{ y: 10, easing: quintOut, duration: 700 }}>
	<div class="menu">
		<div class="doc-section-selected">
			<h3>Prerequisites</h3>
		</div>
		<div class="doc-section">
			<h3>Using ReVanced CLI and installiing ReVanced</h3>
		</div>
	</div>
	<div class="content">
		<h6>docs/prerequisites</h6>
		<br />
		<h4>Requirements</h4>
		<h5>
			<ul>
				<li>ADB</li>
				<li>x86/x86_64 host architecture</li>
				<li>Zulu JDK 17</li>
				<li>Latest Android SDK if you plan to build the integrations from the source</li>
				<li>
					The APK file you want to patch (e.g. YouTube v17.36.37 or YouTube Music v5.23.50). If you
					want to mount patched applications as root, make sure the same version is installed on
					your device.
				</li>
				<li>
					You can continue by either building everything from source or downloading the prebuilt
					packages.
				</li>
			</ul>
			<br />
			You can continue by either
			<a href="https://github.com/revanced/revanced-documentation/wiki/Building-from-source"
				>building everything from source</a
			>
			or
			<a
				href="https://github.com/revanced/revanced-documentation/wiki/Downloading-prebuilt-packages"
				>downloading the prebuilt packages</a
			>.
		</h5>
		<br />
		<br />
		<div class="button-wrapper">
			<Button kind="secondary">Using ReVanced CLI and installing ReVanced -></Button
			>
		</div>
	</div>
</main>

<style>
	main {
		display: grid;
		grid-template-columns: 300px 3fr;
	}

	a {
		text-decoration: none;
		color: var(--white);
		border-bottom: 1.5px solid var(--accent-color);
		padding: 0px 5px;
		transition: all 0.4s var(--bezier-one);
	}

	a:hover {
		background-color: var(--accent-color);
		border-radius: 6px;
		color: var(--grey-four);
	}

	.menu,
	.content {
		height: 100vh;
		width: 100%;
	}

	.menu {
		padding: 90px 15px 0px 15px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.content {
		padding: 100px 30px 0px 30px;
	}

	.doc-section {
		background-color: var(--grey-one);
		border-radius: 12px;
		padding: 15px 20px;
	}

	.doc-section-selected {
		background-color: var(--grey-three);
		border-radius: 12px;
		padding: 15px 20px;
	}

	.doc-section-selected > h3 {
		color: var(--white);
	}

	.button-wrapper {
		width: 30rem;
	}

	ul {
		padding-left: 2rem;
	}

	h4 {
		margin-bottom: 0.5rem;
	}
</style>
