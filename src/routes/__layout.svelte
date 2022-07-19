<script>

import Button from "$lib/components/atoms/Button.svelte";
import NavHost from "$lib/components/molecules/NavHost.svelte";
import SocialButton from "$lib/components/atoms/SocialButton.svelte";
import SocialHost from "$lib/components/molecules/SocialHost.svelte";
import Wave from '$lib/components/atoms/Wave.svelte';

</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
		rel="stylesheet"
	/>
	<meta name="og:title" content="ReVanced"/>
	<meta name="og:image" itemprop="image" content="/embed.png">
	<meta property="og:description" content="An extensible framework for building application mods.">
	<meta name="twitter:image" itemprop="image" content="/embed.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="theme-color" content="#0f111a">
	<title>ReVanced</title>
	<link rel="stylesheet" href="css/styles.css" />
</svelte:head>

<NavHost></NavHost>
<slot />
<SocialHost />
<Wave />

<style>
	:global(*) {
		box-sizing: inherit;
		margin: 0;
		padding: 0;
		font-family: 'Manrope', sans-serif;
	}

	:global(html) {
		font-size: 100%;
		box-sizing: border-box;
	}

	:global(body) {
		overflow-y: hidden;
		margin: 0;
		padding: 0;
		line-height: 1.3;
		background-color: #0f111a;
	}

	:global(.wrapper) {
		margin-left: 6%;
		margin-right: 6%;
		margin-top: 3%
	}

	:root {
		--white: #ffe1e1;
		--red: #ff4151;
		--red-glow: #ff838d40;
		--grey-one: #1c1e29;
		--grey-two: #2b2d3a;
		--grey-three: #3e404f;
		--grey-four: #1B1E29;
		--grey-five: #D0D0D0;
	}

	:global(::selection) {
		color: var(--white);
		background: var(--red);
	}

	/*-----headings-----*/

	:global(h1) {
		color: var(--white);
		font-weight: 800;
	}

	:global(h2) {
		color: var(--white);
		font-weight: 300;
		font-size: 1.85rem;
	}

	/*-----scrollbar-----*/

	:global(::-webkit-scrollbar) {
		width: 20px;
		background-color: transparent;
	}

	:global(::-webkit-scrollbar-thumb) {
		background-color: var(--grey-two);
		border-radius: 20px;
		border: 6px solid transparent;
		background-clip: content-box;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background-color: var(--grey-three);
	}
</style>
