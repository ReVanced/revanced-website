<script lang="ts">
	import { onMount } from 'svelte';
	import { horizontalSlide } from '$util/horizontalSlide';
	import { fade } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';

	import Navigation from './NavButton.svelte';
	import Svg from '$lib/components/Svg.svelte';
	import Modal from '$lib/components/Dialogue.svelte';
	import Button from '$lib/components/Button.svelte';

	import * as settings from '$data/api/settings';
	import RouterEvents from '$data/RouterEvents';

	import { useQueryClient } from '@tanstack/svelte-query';

	const client = useQueryClient();

	function reload() {
		location.reload();
	}

	function clear_and_reload() {
		client.clear();
		// `client.clear()` does technically do this for us, but it takes a while.
		localStorage.clear();

		reload();
	}

	let url = settings.api_base_url();

	function save() {
		settings.set_api_base_url(url);
		reload();
	}

	function reset() {
		url = settings.default_base_url;
	}

	let menuOpen = false;
	let modalOpen = false;
	let y: number;

	onMount(() => {
		return RouterEvents.subscribe((event) => {
			if (event.navigating) {
				menuOpen = false;
			}
		});
	});
</script>

<svelte:window bind:scrollY={y} />

<nav class:scrolled={y > 10}>
	<a class="menu-btn skiptab-btn" href="#skiptab">Skip navigation</a>

	<button
		class="menu-btn mobile-only"
		on:click={() => (menuOpen = !menuOpen)}
		class:open={menuOpen}
		aria-label="Menu"
	>
		<span class="menu-btn__burger" />
	</button>
	<a href="/" id="logo"><img src="/logo.svg" alt="ReVanced Logo" /></a>

	{#key menuOpen}
		<div
			class="nav-wrapper"
			class:desktop-only={!menuOpen}
			transition:horizontalSlide={{ direction: 'inline', easing: expoOut, duration: 400 }}
		>
			<div id="main-navigation">
				<ul class="nav-buttons">
					<Navigation href="/" label="Home">Home</Navigation>
					<Navigation queryKey="manager" href="/download" label="Download">Download</Navigation>
					<Navigation queryKey="patches" href="/patches" label="Patches">Patches</Navigation>
					<Navigation queryKey="repositories" href="/contributors" label="Contributors">
						Contributors
					</Navigation>
					<Navigation queryKey={['donate', 'team']} href="/donate" label="Donate">
						Donate
					</Navigation>
				</ul>
			</div>
			<div id="secondary-navigation">
				<button on:click={() => (modalOpen = !modalOpen)} aria-label="Settings">
					<Svg viewBoxHeight={24} svgHeight={20}>
						<path
							d="M 19.1 12.9 C 19.1 12.6 19.2 12.3 19.2 12 C 19.2 11.7 19.2 11.4 19.1 11.1 L 21.1 9.5 C 21.3 9.4 21.3 9.1 21.2 8.9 L 19.3 5.6 C 19.2 5.4 18.9 5.3 18.7 5.4 L 16.3 6.4 C 15.8 6 15.3 5.7 14.7 5.5 L 14.3 3 C 14.3 2.8 14.1 2.6 13.8 2.6 L 10 2.6 C 9.8 2.6 9.6 2.8 9.5 3 L 9.2 5.3 C 8.7 5.6 8.1 5.9 7.6 6.3 L 5.2 5.3 C 5 5.2 4.8 5.3 4.6 5.5 L 2.7 8.9 C 2.6 9.1 2.7 9.3 2.9 9.5 L 4.9 11.1 C 4.9 11.4 4.8 11.7 4.8 12 C 4.8 12.3 4.8 12.6 4.9 12.9 L 2.9 14.5 C 2.7 14.6 2.7 14.9 2.8 15.1 L 4.7 18.4 C 4.8 18.6 5.1 18.7 5.3 18.6 L 7.7 17.6 C 8.2 18 8.7 18.3 9.3 18.5 L 9.7 21 C 9.8 21.2 9.9 21.4 10.2 21.4 L 14 21.4 C 14.2 21.4 14.4 21.2 14.5 21 L 14.9 18.5 C 15.5 18.3 16 17.9 16.5 17.6 L 18.9 18.6 C 19.1 18.7 19.4 18.6 19.5 18.4 L 21.4 15.1 C 21.5 14.9 21.5 14.6 21.3 14.5 L 19.1 12.9 Z M 12 15.6 C 10 15.6 8.4 14 8.4 12 C 8.4 10 10 8.4 12 8.4 C 14 8.4 15.6 10 15.6 12 C 15.6 14 14 15.6 12 15.6 Z"
						/>
					</Svg>
				</button>
			</div>
		</div>
	{/key}

	{#if menuOpen}
		<div
			class="overlay mobile-only"
			transition:fade={{ duration: 350 }}
			on:click={() => (menuOpen = !menuOpen)}
			on:keypress={() => (menuOpen = !menuOpen)}
		/>
	{/if}
</nav>

<!-- settings -->
<Modal bind:modalOpen>
	<svelte:fragment slot="icon">
		<Svg viewBoxHeight={24} viewBoxWidth={24} svgHeight={24}>
			<rect fill="none" height="24" width="24" />
			<path
				d="M19.5,12c0-0.23-0.01-0.45-0.03-0.68l1.86-1.41c0.4-0.3,0.51-0.86,0.26-1.3l-1.87-3.23c-0.25-0.44-0.79-0.62-1.25-0.42 l-2.15,0.91c-0.37-0.26-0.76-0.49-1.17-0.68l-0.29-2.31C14.8,2.38,14.37,2,13.87,2h-3.73C9.63,2,9.2,2.38,9.14,2.88L8.85,5.19 c-0.41,0.19-0.8,0.42-1.17,0.68L5.53,4.96c-0.46-0.2-1-0.02-1.25,0.42L2.41,8.62c-0.25,0.44-0.14,0.99,0.26,1.3l1.86,1.41 C4.51,11.55,4.5,11.77,4.5,12s0.01,0.45,0.03,0.68l-1.86,1.41c-0.4,0.3-0.51,0.86-0.26,1.3l1.87,3.23c0.25,0.44,0.79,0.62,1.25,0.42 l2.15-0.91c0.37,0.26,0.76,0.49,1.17,0.68l0.29,2.31C9.2,21.62,9.63,22,10.13,22h3.73c0.5,0,0.93-0.38,0.99-0.88l0.29-2.31 c0.41-0.19,0.8-0.42,1.17-0.68l2.15,0.91c0.46,0.2,1,0.02,1.25-0.42l1.87-3.23c0.25-0.44,0.14-0.99-0.26-1.3l-1.86-1.41 C19.49,12.45,19.5,12.23,19.5,12z M12.04,15.5c-1.93,0-3.5-1.57-3.5-3.5s1.57-3.5,3.5-3.5s3.5,1.57,3.5,3.5S13.97,15.5,12.04,15.5z"
			/>
		</Svg>
	</svelte:fragment>
	<svelte:fragment slot="title">Settings</svelte:fragment>
	<svelte:fragment slot="description">Configure the API for this website.</svelte:fragment>
	<div id="settings-content">
		<div class="input-wrapper">
			<input name="api-url" type="text" bind:value={url} />
			<button id="button-reset" on:click={reset} aria-label="Reset Button">
				<Svg viewBoxHeight={48} svgHeight={24}>
					<path
						d="M11.2 36.725C14.6667 40.2417 18.8833 42 23.85 42C26.35 42 28.7 41.525 30.9 40.575C33.1 39.625 35.025 38.3333 36.675 36.7C38.325 35.0667 39.625 33.15 40.575 30.95C41.525 28.75 42 26.4 42 23.9C42 21.4 41.525 19.0667 40.575 16.9C39.625 14.7333 38.325 12.8417 36.675 11.225C35.025 9.60833 33.1 8.33333 30.9 7.4C28.7 6.46667 26.35 6 23.85 6C21.1833 6 18.6583 6.58333 16.275 7.75C13.8917 8.91667 11.8333 10.5167 10.1 12.55V7.25H7.1V17.65H17.55V14.65H12.3C13.7667 12.95 15.4917 11.5833 17.475 10.55C19.4583 9.51667 21.5833 9 23.85 9C28.0167 9 31.5833 10.425 34.55 13.275C37.5167 16.125 39 19.6167 39 23.75C39 27.9833 37.5333 31.5833 34.6 34.55C31.6667 37.5167 28.0833 39 23.85 39C19.6833 39 16.1667 37.5333 13.3 34.6C10.4333 31.6667 9 28.1167 9 23.95H6C6 28.95 7.73333 33.2083 11.2 36.725Z"
					/>
				</Svg>
			</button>
		</div>
	</div>

	<svelte:fragment slot="buttons">
		<Button type="text" on:click={clear_and_reload} label="Reset Button">Reset</Button>
		<Button type="text" on:click={save} label="Save Button">Save</Button>
	</svelte:fragment>
</Modal>

<style>
	#logo {
		padding: 0.5rem;
	}

	path {
		fill: var(--grey-five);
	}

	button:hover path {
		fill: var(--accent-color-two);
	}

	button {
		background-color: transparent;
		border: none;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.input-wrapper {
		margin-bottom: 0.75rem;
		display: flex;
		justify-content: space-between;
		position: relative;
	}

	input {
		width: 100%;
		position: relative;
		padding-right: 3rem;
		margin-top: 1rem;
	}

	#button-reset {
		position: absolute;
		right: 12px;
		top: 30px;
	}

	nav {
		position: fixed;
		top: 0;
		display: flex;
		gap: 2rem;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		z-index: 666;
		height: 70px;
		background-color: var(--grey-seven);
		width: 100%;
	}

	#main-navigation,
	#secondary-navigation {
		align-items: center;
		display: flex;
		gap: 2rem;
	}

	a {
		display: flex;
	}

	img {
		height: 22px;
	}

	.nav-buttons {
		display: flex;
		gap: 1rem;
	}

	.scrolled {
		box-shadow: var(--drop-shadow-one);
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 88;
	}

	.nav-wrapper {
		display: flex;
		width: 100%;
		justify-content: space-between;
	}

	@media (min-width: 768px) {
		.nav-wrapper {
			align-items: center;
		}
	}

	@media (max-width: 767px) {
		.nav-wrapper {
			flex-direction: column;
			gap: 0.5rem;
			height: 100%;
			margin: 0 auto;
			position: fixed;
			width: 20rem;
			top: 0px;
			border-radius: 0px 24px 24px 0px;
			left: 0px;
			background-color: var(--grey-seven);
			padding: 1rem;
			padding-top: 6rem;
			z-index: 100;
		}

		.desktop-only {
			display: none !important;
		}

		nav {
			justify-content: normal;
		}

		.nav-buttons {
			flex-direction: column;
			gap: 0.5rem;
			width: 100%;
		}

		#secondary-navigation {
			z-index: 100;
			padding: 16px;
		}
	}

	@media screen and (min-width: 768px) {
		.mobile-only {
			display: none !important;
		}
	}

	/* Hamburger mmm yum */
	.menu-btn {
		user-select: none;
		position: relative;
		display: flex;
		height: 50px;
		z-index: 999;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
	.menu-btn__burger {
		display: flex;
		flex-wrap: wrap;
	}

	.menu-btn__burger,
	.menu-btn__burger::before,
	.menu-btn__burger::after {
		width: 24px;
		height: 2px;
		background: var(--grey-five);
		transition: all 0.3s var(--bezier-one);
	}

	.menu-btn__burger::before,
	.menu-btn__burger::after {
		content: '';
		position: absolute;
	}
	.menu-btn__burger::before {
		transform: translateY(-6.5px);
	}
	.menu-btn__burger::after {
		transform: translateY(6.5px);
	}
	/* ANIMATION */
	.menu-btn.open .menu-btn__burger {
		transform: translateX(-10px);
		background: transparent;
		box-shadow: none;
	}
	.menu-btn.open .menu-btn__burger::before {
		transform: rotate(45deg) translate(10px, -10px);
	}
	.menu-btn.open .menu-btn__burger::after {
		transform: rotate(-45deg) translate(10px, 10px);
	}

	.skiptab-btn {
		position: fixed;
		left: -300px;
		border-radius: 100px;
		text-decoration: none;
		background-color: var(--accent-color);
		z-index: 10;
		color: var(--grey-four);
		font-weight: 600;
		font-size: 0.95rem;
		padding: 16px 24px;
	}

	.skiptab-btn:focus {
		left: 12px;
	}
</style>
