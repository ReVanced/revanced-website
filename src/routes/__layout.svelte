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

	::selection {
		color: var(--white);
		background: var(--red);
	}

	/*-----headings-----*/

	h1 {
		color: var(--white);
		font-weight: 800;
	}

	h3 {
		color: var(--white);
		font-weight: 300;
		font-size: 1.85rem;
	}

	/*-----scrollbar-----*/

	::-webkit-scrollbar {
		width: 20px;
	}

	::-webkit-scrollbar-track {
		background-color: transparent;
	}

	::-webkit-scrollbar-thumb {
		background-color: var(--grey-two);
		border-radius: 20px;
		border: 6px solid transparent;
		background-clip: content-box;
	}

	::-webkit-scrollbar-thumb:hover {
		background-color: var(--grey-three);
	}

	/*-----navbar-----*/

	.logo {
		color: #0f111a;
		font-weight: 800;
		font-size: 2.5rem;
	}

	nav {
		width: 100%;
		display: flex;
		padding: 1.5rem 4rem 1.5rem 4rem;
		justify-content: space-between;
		align-items: center;
	}

	nav li {
		width: 160px;
		text-align: center;
		list-style: none;
		display: inline-block;
		position: relative;
		align-items: center;
	}

	nav a {
		color: var(--white);
		text-decoration: none;
		font-size: 1.25rem;
	}

	nav li:hover {
		font-weight: 600;
		border: 3px solid var(--grey-two);
		padding: 10px 30px;
		border-radius: 200px;
	}

	/*-----body-----*/

	.wrapper {
		padding-left: 6rem;
		padding-right: 6rem;
	}

	.hero-text {
		margin-top: 3%;
		align-items: center;
	}

	.hero-text h1 {
		font-size: 6.5rem;
		letter-spacing: -0.04em;
	}

	.redder {
		color: var(--red);
	}

	button {
		font-weight: 600;
		color: var(--white);
		border: 3px solid var(--red);
		border-radius: 200px;
		padding: 12px 40px;
		cursor: pointer;
		background-color: transparent;
	}

	.hero-text button {
		font-size: 1.5rem;
		margin-top: 45px;
		transform: translateX(-5%);
		transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
		transition-duration: 0.4s;
	}

	.filled-button {
		background-color: var(--red);
	}

	.hero-text .filled-button {
		margin-right: 20px;
		box-shadow: 0px 0px 32px 1px var(--red-glow);
	}

	.hero-text .filled-button:hover {
		box-shadow: 0px 0px 32px 1px var(--red-glow), 0px 0px 32px 1px var(--red-glow);
	}

	.hero-text button:hover {
		transform: translate(-5%, -5%);
	}

	.hero-img {
		width: 400px;
		border-radius: 20px;
		float: right;
		transform: rotate(3.7deg) translateY(-24%) translateX(-12%);
	}
</style>
