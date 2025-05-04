<script lang="ts">
	type Props = { title?: string };
	let { title }: Props = $props();

	const pageTitle = title ? `ReVanced - ${title.trim()}` : 'ReVanced';
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>
