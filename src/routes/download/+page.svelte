<script lang="ts">
	import { tools } from '../../data/api';
	import Button from '$lib/components/atoms/Button.svelte';
	import Footer from '$lib/components/molecules/Footer.svelte';

	$: manager = $tools['revanced/revanced-manager'];
</script>

<div class="wrapper">
	<h1>ReVanced <span>Manager</span></h1>
	<h6>Patch your favourite apps, on-device.</h6>
	<Button kind="primary" icon="download" target="_blank" href={manager.assets[0].url}>{manager.version}</Button>
	<img src="../manager_two.png" alt="Manager Screenshot" />
</div>

<Footer />

<style>
	div {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	h1 {
		font-size: 3rem;
		text-align: center;
		color: var(--white);

	}

	h6 {
		text-align: center;
		margin-bottom: 1.5rem;
	}

	img {
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
