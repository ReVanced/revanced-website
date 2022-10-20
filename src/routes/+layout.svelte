<script lang="ts">
	import NavHost from "$lib/components/molecules/Navigation.svelte";
	import '../app.css';
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="og:title" content="ReVanced"/>
	<meta name="og:image" itemprop="image" content="/embed.png">
	<meta property="og:description" content="An extensible framework for building application mods.">
	<meta name="twitter:image" itemprop="image" content="/embed.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="theme-color" content="#0f111a">
	<title>ReVanced</title>
</svelte:head>

<NavHost/>
<slot />
