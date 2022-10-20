<script lang="ts">
    import ContributorHost from '$lib/components/molecules/ContributorHost.svelte';
    import ContributorsStore from '../../lib/stores/ContributorsStore.js';
    import { onMount } from "svelte";

    let data;

    onMount (() => {
        ContributorsStore.subscribe(async (e) => {
            data = await e;
        });
    });
</script>

<div class="wrapper contrib-grid">
    {#if data}
        {#each data.repositories as { contributors, name }}
            <ContributorHost contribs={contributors} repo={name}/>
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