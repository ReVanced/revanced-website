<script lang="ts">
    import ContributorButton from "../atoms/ContributorButton.svelte";
    export let peoples: Array<String>;
</script>

<div class="social-host">
    {#each peoples as person}
        <ContributorButton username={person}></ContributorButton>
    {/each}
</div>

<style>
    .social-host {
        gap: 2rem;
        width: 100;
        display: grid;
		align-items: center;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
</style>