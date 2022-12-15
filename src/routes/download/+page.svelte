<script lang="ts">
	import { tools } from '../../data/api';

	import Button from '$lib/components/atoms/Button.svelte';
	import Footer from '$lib/components/molecules/Footer.svelte';
  import Picture from '$lib/components/atoms/Picture.svelte';

  import manager_screenshot from '$images/manager_two.png?format=avif;webp;png&picture';

	$: manager = $tools['revanced/revanced-manager'];
</script>

<div class="wrapper center">
	<h1>ReVanced <span>Manager</span></h1>
	<h4>Patch your favourite apps, right on your device.</h4>
	<div class="buttons">
		<Button kind="primary" icon="download" href={manager.assets[0].url} target="_blank">{manager.version}</Button>
		<Button href="https://github.com/revanced/revanced-manager" target="_blank">View Source</Button>
	</div>
  <div class="screenshot">
    <Picture data={manager_screenshot} alt="Manager Screenshot" />
  </div>
</div>

<Footer />

<style>
	.center {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	h1 {
		text-align: center;
		color: var(--white);

	}

	h4 {
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.screenshot :global(img) {
		margin-top: 2.5rem;
		margin-bottom: 2.5rem;
		height: 50rem;
		width: auto;
		padding: 0.5rem 0.5rem;
		border-radius: 2rem;
		background-color: var(--grey-six);
		user-select: none;
	}

	.buttons {
		display: flex;
		gap: 1rem;
	}

	
	span {
		color: var(--accent-color)
	}
</style>
