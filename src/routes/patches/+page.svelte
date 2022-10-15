<script lang="ts">
    import Patch from "$lib/components/atoms/Patch.svelte";
    import PatchesStore from "$lib/stores/PatchesStore";
    import { onMount } from "svelte";
    import { fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    let patches: any;
    let pkg_list = [];

    let current = 'all';

    onMount (async () => {
        PatchesStore.subscribe(async (e) => {
            patches = await e;
            console.log(patches);

            for (let i = 0; i < patches.length; i++) {
                patches[i].compatiblePackages.forEach(pkg => {
                    let index = pkg_list.findIndex(x => x == pkg.name); 
                    if (index === -1) {
                        pkg_list.push(pkg.name);
                        pkg_list = pkg_list;
                    };
                });
            };
        });

    });

    
</script>

<section>
    <div 
        class="menu" 
    >
        {#if pkg_list}
        <div in:fly="{{ y: 10, easing: quintOut, duration: 750}}">
            <h3>PACKAGES</h3>
            <div class="package-list">
                {#each pkg_list as pkg, i }
                    <div 
                        class="package"
                        class:selected={current === pkg}
                        on:click={() => current = pkg}
                    > 
                        <h3>{pkg}</h3>
                    </div>
                {/each}
            </div>
        </div>
        {/if}
        
    </div>

        {#if patches}
            <div class="patches-list patches-container">
                {#each patches as patch, i}
                    <div in:fly="{{ x: 10, easing: quintOut, duration: 750, delay: (80 * i)}}">
                        <Patch
                            name={patch.name
                                // im sorry
                                .replace(/-/g, ' ')
                                .replace(/(?:^|\s)\S/g, x => x.toUpperCase())
                                .replace(/Microg/g, 'MicroG')
                                .replace(/Hdr/g, 'HDR')
                                .replace(/Sponsorblock/g, 'SponsorBlock')
                                .replace(/Tiktok/g, 'TikTok')
                            }
                            desc={patch.description}
                            ver={patch.version}
                            hasPatchOptions={!!patch.options.length}
                        />
                    </div>
                {/each}
            </div>
        {/if}
</section>

<style>
    section {
        padding-top: 4.25rem;
        margin-inline: auto;
        width: min(95%, 100rem);
        display:grid;
        grid-template-columns: 300px 3fr;
        gap: 1rem;
    }

    .patches-container {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding-bottom: 3rem;
        overflow-y: scroll;
        height: calc(100vh - 4.25rem);
        width:100%;
        padding-top: 3rem;
        padding-right: 1rem;
    }

    .menu {
        height: calc(100vh - 10rem);
        width:100%;
        margin-top: 3rem;
        padding: 0px 15px 0px 15px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .package-list {
        display: flex;
        flex-direction: column;
        white-space: normal;
        word-break: break-all;
    }

    .package {
        padding: 0.6rem;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        gap: 0.6rem;
        width: 100%;
        user-select: none;
        transition: all 0.4s var(--bezier-one);
    }

    .package::before {
        content: '';
        inline-size: 4px;
        border-radius: 200px;
        background-color: var(--red);
        opacity: 0;
    }

    .selected::before{
        opacity: 1;
    }

    .package > h3 {
        color: var(--grey-five);
    }

    .selected {
        background-color: var(--grey-three);
    }
    .selected > h3 {
        color: var(--red);
    }

    .package:not(.selected):hover {
        background-color: var(--grey-six);
    }
</style>
