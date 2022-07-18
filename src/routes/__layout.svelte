<script>

import Button from "$lib/components/atoms/Button.svelte";
import NavHost from "$lib/components/molecules/NavHost.svelte";

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
	<title>ReVanced</title>
	<link rel="stylesheet" href="css/styles.css" />
</svelte:head>

<NavHost></NavHost>
<slot />


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
		overflow-x: hidden;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		line-height: 1.3;
		background-color: #0f111a;
	}

	:root {
		--white: #ffe1e1;
		--red: #ff4151;
		--red-glow: #ff838d40;
		--grey-one: #1c1e29;
		--grey-two: #2b2d3a;
		--grey-three: #3e404f;
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

	:global(h3) {
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

	:global(::-webkit-scrollbar-track-piece){
		display:none;
	}

	:global(::-webkit-scrollbar-track) {
  		background: rgba(0, 0, 0, 0.2);
	}
</style>
