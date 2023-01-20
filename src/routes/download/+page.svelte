<script lang="ts">
	import { manager } from '$data/api';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

import { createQuery } from '@tanstack/svelte-query'

	import manager_screenshot from '$images/manager_two.png?format=avif;webp;png&picture';

	import Meta from '$lib/components/Meta.svelte';
	import Button from '$lib/components/Button.svelte';
	import Footer from '$layout/Footer.svelte';
	import Picture from '$lib/components/Picture.svelte';

const query = createQuery({
  queryKey: ['manager'],
  queryFn: () => manager(),
});
</script>

<Meta title="Download" />

<div class="wrapper center" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	<h2>ReVanced <span>Manager</span></h2>
	<p>Patch your favourite apps, right on your device.</p>
	<div class="buttons">
    {#if $query.isSuccess}
		<Button kind="primary" icon="download" href={$query.data.assets[0].url} target="_blank">
			{$query.data.version}
		</Button>
    {/if}
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

	h2 {
		text-align: center;
		color: var(--white);
	}

	p {
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
		color: var(--accent-color);
	}
</style>
