<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import type { Patch } from '$lib/types';
	import type { PatchesData } from '../../data/PatchesStore';
	import { PatchesStore } from '../../data/PatchesStore';

	import TreeMenu from '$lib/components/molecules/TreeMenu.svelte';
	import TreeMenuButton from '$lib/components/atoms/TreeMenuButton.svelte';
	import PatchCell from '$lib/components/atoms/PatchCell.svelte';
	import Footer from '$lib/components/molecules/Footer.svelte';

	let patches: Patch[]
    let packages: string[];
	let current: boolean = false;

	onMount(() => {
		PatchesStore.subscribe(async (e: Promise<PatchesData>) => {
			({ patches, packages } = await e);
		});
	});

    function search(findTerm, array){
        for (let i = 0; i < array.length; i++) {
            if (array[i].name === findTerm) {
                return true;
            };
        };
        return false;
    };
</script>

<svelte:head>
	<title>Revanced - Patches</title>
	<meta content="Revanced - Patches" name="og:title" />
	<meta content="Revanced - Patches" name="twitter:title" />
</svelte:head>

<section>
	<aside in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
		<TreeMenu title="packages">
			{#if packages}
				{#each packages as pkg}
					<TreeMenuButton bind:current name={pkg} />
				{/each}
			{/if}
		</TreeMenu>
	</aside>

	<div class="patches-container">
		{#if patches}
			{#each patches as { name, description, version, options, compatiblePackages }, i}
                {#if search(current, compatiblePackages) || !current}
                    <div in:fly={{ x: 10, easing: quintOut, duration: 750, delay: -(300 * 0.85 ** i) + 300 }}>
                        <PatchCell
                            bind:current
                            {name}
                            {description}
                            {version}
                            {options}
                            {compatiblePackages}
                            hasPatchOptions={!!options.length}
                        />
                    </div>
                {/if}
			{/each}
		{/if}
	</div>
</section>
<Footer />

<style>
	section {
		margin-inline: auto;
		width: min(95%, 100rem);
		display: grid;
		grid-template-columns: 300px 3fr;
		gap: 1.5rem;
		padding-bottom: 3rem;
	}

	.patches-container {
		margin-top: 7.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
		position: sticky;
		z-index: 1;
        min-height: calc(100vh - 7.5rem);
	}

	/* 
    pulsing todo:
	@keyframes pulse {
		0% {
			background-position: right; 
        }
    }
	.loading {
		height: 50px;
		background: linear-gradient(90deg, var(--grey-six) 33%, var(--grey-one) 50%, var(--grey-six) 66%) var(--grey-six);
		background-size: 300% 100%;
		animation: pulse 2s infinite;
        margin-bottom: 0.5rem;
	} */
</style>
