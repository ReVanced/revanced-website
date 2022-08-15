<script>
    import ContributorButton from "../atoms/ContributorButton.svelte";
</script>

<div class="social-host">
    <ContributorButton></ContributorButton>
</div>

<style>
    .social-host {
        width: 100;
        gap:2rem;
		align-items: center;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
</style>