<script lang="ts">
	import type { WithChildren } from '$types';
	import { JsonLd } from 'svelte-meta-tags';

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
</svelte:head>

<!--
	Keep JsonLd OUTSIDE <svelte:head>. It already renders his own <svelte:head> so the ld+json script ends up in the document head.

	Nesting it here makes SSR put the head anchor in the wrong place. Then the client removes it during hydration and the hydration cursor ends up pointing at a detached node
	so the next step runs past the end of the DOM and hydration blows up.
-->

{#if schemas}
	{#each schemas as schema}
		<JsonLd {schema} />
	{/each}
{/if}

{@render children()}
