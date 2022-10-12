<script lang="ts">
    import ContributorsStore from "../../stores/ContributorsStore.js";
    import ContributorButton from "../atoms/ContributorButton.svelte";
    import { onMount } from "svelte";
    import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
   
    let contribs;
    export let repo: string;

    onMount (() => {
        ContributorsStore.subscribe(async (data) => {
            contribs = await data;
            contribs = contribs[repo].contributors
        });
    });

    let usersIwantToExplodeSoBadly = [
        'semantic-release-bot',
    ]
</script>

{#if contribs}
    <div class="container" in:fly="{{ y: 10, easing: quintOut, duration: 700 }}">
        <h2>
            ReVanced {repo === 'cli' ? 'CLI' : repo.charAt(0).toUpperCase() + repo.slice(1)}
        </h2>

        <div class="contrib-host">    
            {#each contribs as contrib}
                {#if !usersIwantToExplodeSoBadly.includes(contrib.login)}
                    <ContributorButton name={contrib.login} pfp={contrib.avatar_url} url={contrib.html_url} />
                {/if}
            {/each}
        </div>
    </div>
{/if}

<style>
    h2 {
        margin-bottom: 1rem;
    }
    .contrib-host {
        gap: 1.5rem;
        display: grid;
		align-items: center;
        grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
        background-color: var(--grey-six);
        padding: 1.5rem;
        border-radius: 28px;
    }

    /* temporary, put into main wrapper when homepage is more fleshed out */
    .container {
        margin-bottom: 3rem;
    }
</style>