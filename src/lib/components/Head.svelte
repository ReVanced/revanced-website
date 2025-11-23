<script lang="ts">
	import { JsonLd } from 'svelte-meta-tags';

	let {
		title: _title = '',
		description = 'Continuing the legacy of Vanced.',
		schemas
	}: {
		title?: string;
		description?: string;
		schemas?: Record<string, unknown>[] | undefined;
	} = $props();

	const title = $derived(_title === '' ? 'ReVanced' : `ReVanced - ${_title}`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="theme-color" content="#9FD5FF" />

	<!-- OpenGraph -->
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />

	<!-- Twitter -->
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
</svelte:head>

{#if schemas}
	{#each schemas as schema}
		<JsonLd {schema} />
	{/each}
{/if}
