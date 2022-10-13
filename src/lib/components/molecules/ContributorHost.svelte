<script lang="ts">
    import ContributorsStore from "../../stores/ContributorsStore.js";
    import ContributorButton from "../atoms/ContributorButton.svelte";
    import { onMount } from "svelte";
    import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
   
    let contribs: Object;
    let repo_link: string;
    export let repo: string;

    onMount (() => {
        ContributorsStore.subscribe(async (e) => {
            let data = await e;
            repo_link = 'https://github.com/' + data[repo].name;
            contribs = data[repo].contributors
        });
    });

    let usersIwantToExplodeSoBadly = [
        'semantic-release-bot',
    ]
    
</script>

{#if contribs}
    <div class="container" in:fly="{{ y: 10, easing: quintOut, duration: 700 }}">
        <a href={repo_link} target="_blank">
            <h2>ReVanced {repo === 'cli' ? 'CLI' : repo.charAt(0).toUpperCase() + repo.slice(1)}</h2>
        </a>
        <div class="contrib-host">    
            {#each contribs as contrib}
                {#if !usersIwantToExplodeSoBadly.includes(contrib.login)}
                    <ContributorButton 
                        name={contrib.login} 
                        pfp={contrib.avatar_url} 
                        url={contrib.html_url} 
                    />
                {/if}
            {/each}
        </div>
    </div>
{/if}

<style>

    h2 {
        margin-bottom: 1rem;
    }
    a {
        transition: all 0.3s var(--bezier-one);
        display:block;
        text-decoration: none;
        width: max-content;
        border-radius: 8px;
    }

    a > h2 {
        transition: all 0.3s var(--bezier-one);
        width: max-content;
        padding: 0rem 0.4rem;
        border-radius: 8px;
    }

    a:hover > h2 {
        width: max-content;
        background-color: var(--grey-three);
        color: var(--red);
    }

    .contrib-host {
        gap: 1.5rem;
        display: grid;
        justify-items: center;
        grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
        background-color: var(--grey-six);
        padding: 1.5rem;
        border-radius: 28px;
    }

</style>