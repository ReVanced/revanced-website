<script>
    import DownloadSelector from "../atoms/DownloadSelector.svelte";
</script>

<div class="download-selector-main">
    <DownloadSelector></DownloadSelector>
    <DownloadSelector></DownloadSelector>
    <DownloadSelector></DownloadSelector>
    <DownloadSelector></DownloadSelector>
    <DownloadSelector></DownloadSelector>
    <DownloadSelector></DownloadSelector>
    <DownloadSelector></DownloadSelector>
</div>


<style>
    .download-selector-main {
        background-color: var(--grey-one);
        margin-top: 2rem;
        padding: 0.75rem 0.75rem;
        border-radius: 25px;
        width: 100%;
        gap:0.9rem;
        display:grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
        grid-auto-flow: column;
        overscroll-behavior-x: contain;
        scroll-snap-type: x mandatory;
        overflow-x: scroll;

    }
</style>