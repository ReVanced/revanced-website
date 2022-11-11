<script lang="ts">
	import { tools } from '../../data/api';
	import Button from '$lib/components/atoms/Button.svelte';
	import Footer from '$lib/components/molecules/Footer.svelte';

  $: manager = $tools["revanced/revanced-manager"];
</script>

<div class="wrapper">
	<h1>ReVanced Manager</h1>
	<h6>Patch your favourite apps, on-device.</h6>
	<Button kind="primary" icon="download" href={manager.assets[0].url}>{manager.version}</Button>
	<img src="../manager_two.png" alt="Manager Screenshot"/>
</div>

<Footer />

<style>

	div {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	h1 {
		font-size: 2.25rem;
		font-weight: 600;
		text-align: center;
		color: var(--accent-color);
	}

	h6 {
		text-align: center;
		margin-bottom: 1.5rem;
	}

	img { 
		margin-top: 2.5rem;
		margin-bottom: 2.5rem;
		width: 25rem;
	}
</style>
