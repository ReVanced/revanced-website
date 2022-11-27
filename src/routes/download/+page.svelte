<script lang="ts">
	import { tools } from '../../data/api';

	import Button from '$lib/components/atoms/Button.svelte';
	import Footer from '$lib/components/molecules/Footer.svelte';
  import Picture from '$lib/components/atoms/Picture.svelte';

  import manager_screenshot from '$images/manager_two.png?format=avif;webp;png&picture';

	$: manager = $tools['revanced/revanced-manager'];
</script>

<div class="wrapper">
	<h1>ReVanced <span>Manager</span></h1>
	<h4>Patch your favourite apps, on-device.</h4>
	<Button kind="primary" icon="download" target="_blank" href={manager.assets[0].url}>{manager.version}</Button>
  <div class="screenshot">
    <Picture data={manager_screenshot} alt="Manager Screenshot" />
  </div>
</div>

<Footer />

<style>
	div {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	h1 {
		text-align: center;
		color: var(--white);
		margin-bottom: 0.5rem;
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
		padding: 0.75rem 0.75rem;
		border-radius: 2.5rem;
		background-color: var(--grey-two);
		box-shadow:0 50px 100px -20px rgba(16, 22, 31, 0.25), 0 30px 60px -30px rgba(18, 19, 22, 0.767), inset 0 -2px 20px 0 rgba(20, 21, 23, 0.598);
		user-select: none;
	}

	span {
		color: var(--accent-color)
	}
</style>
