<script lang="ts">
    import Patch from "$lib/components/atoms/Patch.svelte";
    import PatchesStore from "$lib/stores/PatchesStore";
    import { onMount } from "svelte";
    import { fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    let patches: any;
    let pkg_list: Object[] = [];

    let current: boolean | Object = false;

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
        })
    });
    
</script>

<section>
    <aside class="menu">
        {#if pkg_list}
        <div in:fly="{{ y: 10, easing: quintOut, duration: 750 }}">
            <h5>PACKAGES</h5>
            <hr/>
            <div class="package-list">
                {#each pkg_list as pkg}
                    <div 
                        class="package"
                        class:selected={ current === pkg }
                        on:click={ () => current = (current === pkg) ? false : pkg }
                    > 
                        <h3>{pkg}</h3>
                    </div>
                {/each}
            </div>
        </div>
        {/if}
    </aside>

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
        gap: 1.5rem;
        padding-bottom: 3rem;
    }

    h5 {
        font-weight: 500;
    }
    h3 {
        font-size: 0.9rem;
    }
    .patches-container {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        width:100%;
        padding-top: 3rem;
        position: sticky;
        z-index:1;

    }

    aside {
        height: calc(100vh - 7.5rem);
        width:100%;
        padding: 0px 10px 30px 10px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        position: sticky;
        top: 7.5rem;
        overflow-y: scroll;

    }

    hr {
        display: block; 
        height: 1px;
        border: 0; 
        border-top: 1px solid var(--grey-three);
        margin-top: 1rem;
    }

    .package-list {
        margin-top: 1rem;
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
        align-items: center;
        gap: 0.6rem;
        width: 100%;
        user-select: none;
        transition: all 0.4s var(--bezier-one);
    }

    .package::before {
        content: '';
        height: 5px;
        inline-size: 4px;
        border-radius: 200px;
        background-color: var(--accent-color);
        transition: all 0.2s var(--bezier-one);
        opacity: 0;
    }

    .selected::before{
        height: 20px;
        transition: all 0.3s var(--bezier-one);
        opacity: 1;
    }
    
    .package > h3 {
        color: var(--grey-five);
        transition: all 0.3s var(--bezier-one);
    }

    .selected > h3 {
        color: var(--accent-color);
        transition: all 0.3s var(--bezier-one);
    }

    .package:hover, .selected {
        background-color: var(--grey-six);
    }
    
    .package:not(.selected):hover > h3 {
        color: var(--white);
    }
</style>
