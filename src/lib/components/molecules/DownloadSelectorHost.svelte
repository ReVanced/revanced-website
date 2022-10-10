<script>
    import DownloadSelector from "../atoms/DownloadSelector.svelte";
</script>

<div class="main">
    <DownloadSelector></DownloadSelector>
    <DownloadSelector></DownloadSelector>
    <DownloadSelector></DownloadSelector>
    <DownloadSelector></DownloadSelector>
    <DownloadSelector></DownloadSelector>
    <DownloadSelector></DownloadSelector>
    <DownloadSelector></DownloadSelector>
</div>

<style>
    .recent, .main {
        background-color: var(--grey-one);
        margin-top: 2rem;
        padding: 0.75rem 0.75rem;
        border-radius: 16px;
    }

    .main {
        gap:0.9rem;
        display:grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
        grid-auto-flow: column;
        overflow-x: scroll;
        -webkit-mask-image: linear-gradient(#ffffff, #e66869);
    }
</style>