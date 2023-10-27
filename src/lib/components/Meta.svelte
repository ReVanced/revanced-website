<script lang="ts">
	import { JsonLd } from 'svelte-meta-tags';
	import { queries } from '$data/api';
	import { createQuery } from '@tanstack/svelte-query';

	let _title: string = '';
	$: title = _title === '' ? 'ReVanced' : `ReVanced · ${_title}`;

	export { _title as title };

	export let description: string = 'Continuing the legacy of Vanced.';

	export let schema: any | undefined;
	
	createQuery(['socials'], queries.socials()).subscribe((query) => {
		schema.publisher.sameAs = query.data?.socials?.map((social) => social.url);
	});
	
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="theme-color" content="#9FD5FF" />

	<!-- OpenGraph -->
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="/embed.png" />

	<!-- Twitter -->
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" itemprop="image" content="/embed.png" />
	<meta name="twitter:card" content="summary" />

	{#if schema}
		<JsonLd {schema} />
	{/if}
</svelte:head>
