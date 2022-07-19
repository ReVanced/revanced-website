<script>
	import DownloadSelection from '../atoms/DownloadSelection.svelte';
</script>

<div class="download-selection">
    <DownloadSelection>Manager</DownloadSelection>
    <DownloadSelection>CLI</DownloadSelection>
    <DownloadSelection>Patches</DownloadSelection>
    <DownloadSelection>Integrations</DownloadSelection>
</div>

<style>
	.download-selection {
		background-color: var(--grey-one);
		border-radius: 200px;
		display: flex;
		justify-content: space-between;

		padding: 8px 8px;
	}
</style>
