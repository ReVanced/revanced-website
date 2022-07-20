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
</div>


<style>
    .download-selector-main {
        margin-top: 2rem;
        padding: 12px 12px;
        border-radius: 25px;
        background-color: var(--grey-one);
        width: 100;
        gap:15px;
		align-items: center;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
</style>