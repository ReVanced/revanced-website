<script lang="ts">
    import ContributorHost from '$lib/components/molecules/ContributorHost.svelte';

</script>

<div class="wrapper contrib-grid">
    <h1>
        <span class="redder">Re</span>Vanced Contributors
    </h1>
    <ContributorHost repo="cli"/>
    <ContributorHost repo="patcher"/>
    <ContributorHost repo="patches"/>
    <ContributorHost repo="integrations"/>
    <ContributorHost repo="manager"/>
</div>

<style>
    .redder {
		color: var(--red);
	}
    h1 {
        text-align: center;
		color: var(--white);
		font-weight: 700;
		font-size: 5rem;
		letter-spacing: -0.04em;
		line-height: 1em;
	}
    .contrib-grid {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    @media screen and (max-width: 1919px) {
		h1 {
			font-size: 3.5rem;
		}
	}
	@media screen and (max-width: 1052px) {
		h1 {
			font-size: 2.5rem;
		}
	}
	@media screen and (max-width: 768px) {
		h1 {
			font-size: 2rem;
		}
	}
</style>