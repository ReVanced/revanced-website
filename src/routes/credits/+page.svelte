<script lang="ts">
  import type { APIOutput } from '../+layout';
	import ContributorHost from '$lib/components/molecules/ContributorHost.svelte';
    import Footer from '$lib/components/molecules/Footer.svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

  // From the layout hydration. See +layout.ts
	export let data: APIOutput;
</script>

<div class="wrapper contrib-grid">
		{#each data.repositories as { contributors, name }}
			<div in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
				<ContributorHost contribs={contributors} repo={name} />
			</div>
		{/each}
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
