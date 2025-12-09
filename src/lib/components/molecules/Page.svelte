<script lang="ts">
	import type { WithChildren } from '$types';

	type Schema = Record<string, unknown>;

	type Props = {
		title?: string;
		description?: string;
		schemas?: Schema[];
	} & WithChildren;

	let { title, description, schemas, children }: Props = $props();

	let pageTitle = $derived.by(() => {
		if (title) return `ReVanced - ${title}`;
		if (description) return `ReVanced - ${description.trim()}`;
		return 'ReVanced';
	});

	let metaDescription = $derived(description ?? 'Continuing the legacy of Vanced.');
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={metaDescription} />
	<meta name="theme-color" content="#9FD5FF" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={metaDescription} />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={metaDescription} />

	{#if schemas}
		{#each schemas as schema}
			{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
		{/each}
	{/if}
</svelte:head>

{@render children()}
