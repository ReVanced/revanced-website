<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import type { ContribData } from '../../data/ContributorsStore';
	import { ContributorsStore } from '../../data/ContributorsStore';
	
	import ContributorHost from '$lib/components/molecules/ContributorHost.svelte';
    import Footer from '$lib/components/molecules/Footer.svelte';
	

	let data: ContribData;

	onMount(() => {
		ContributorsStore.subscribe(async (e: Promise<ContribData>) => {
			data = await e;
		});
	});
	
</script>

<div class="wrapper contrib-grid">
	{#if data}
		{#each data.repositories as { contributors, name }}
			<div in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
				<ContributorHost contribs={contributors} repo={name} />
			</div>
		{/each}
	{/if}
</div>

<style>
	.contrib-grid {
		display: flex;
		flex-direction: column;
		gap: 3rem;
		margin-bottom: 3rem;
	}
</style>

<Footer />
