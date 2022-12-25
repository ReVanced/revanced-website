<script lang="ts">
	import { onMount } from 'svelte';
	import { horizontalSlide } from '$lib/utils';
	import { fade } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';

	import Navigation from './NavButton.svelte';
	import Svg from '$lib/components/Svg.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Button from '$lib/components/Button.svelte';

	import { clear_and_reload } from '$data/api/cache';
	import * as settings from '$data/api/settings';
	import RouterEvents from '$data/RouterEvents';

	let url = settings.api_base_url();

	function save() {
		settings.set_api_base_url(url);
		clear_and_reload();
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
	<button class="menu-btn mobile" on:click={() => (menuOpen = !menuOpen)} class:open={menuOpen}>
		<span class="menu-btn__burger" />
	</button>
	<a href="/" id="logo"><img src="/logo.svg" alt="ReVanced Logo" /></a>

	<div class="desktop">
		<div id="main-navigation">
			<div class="nav-buttons">
				<Navigation href="/">Home</Navigation>
				<Navigation href="/download">Download</Navigation>
				<Navigation href="/patches">Patches</Navigation>
				<div hidden>
					<!-- This is just temporary so the build doesn't fail -->
					<Navigation href="/docs">Docs</Navigation>
				</div>
				<Navigation href="/contributors">Contributors</Navigation>
			</div>
		</div>
		<div id="secondary">
			<button on:click={() => (modalOpen = !modalOpen)}>
				<Svg viewBoxHeight={24} svgHeight={20}>
					<path
						d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.09-.16-.26-.25-.44-.25-.06 0-.12.01-.17.03l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.06-.02-.12-.03-.18-.03-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.09.16.26.25.44.25.06 0 .12-.01.17-.03l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.06.02.12.03.18.03.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-1.98-1.71c.04.31.05.52.05.73 0 .21-.02.43-.05.73l-.14 1.13.89.7 1.08.84-.7 1.21-1.27-.51-1.04-.42-.9.68c-.43.32-.84.56-1.25.73l-1.06.43-.16 1.13-.2 1.35h-1.4l-.19-1.35-.16-1.13-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7-1.06.43-1.27.51-.7-1.21 1.08-.84.89-.7-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13-.89-.7-1.08-.84.7-1.21 1.27.51 1.04.42.9-.68c.43-.32.84-.56 1.25-.73l1.06-.43.16-1.13.2-1.35h1.39l.19 1.35.16 1.13 1.06.43c.43.18.83.41 1.23.71l.91.7 1.06-.43 1.27-.51.7 1.21-1.07.85-.89.7.14 1.13zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
					/>
				</Svg>
			</button>
		</div>
	</div>

	{#if menuOpen}
		<div class="mobile">
			<div
				class="nav-wrapper"
				transition:horizontalSlide={{ direction: 'inline', easing: expoOut, duration: 400 }}
			>
				<div id="main-navigation">
					<div class="nav-buttons">
						<Navigation href="/">Home</Navigation>
						<Navigation href="/download">Download</Navigation>
						<Navigation href="/patches">Patches</Navigation>
						<div hidden>
							<!-- This is just temporary so the build doesn't fail -->
							<Navigation href="/docs">Docs</Navigation>
						</div>
						<Navigation href="/contributors">Contributors</Navigation>
					</div>
				</div>
				<div id="secondary-navigation">
					<button on:click={() => (modalOpen = !modalOpen)}>
						<Svg viewBoxHeight={24} svgHeight={20}>
							<path
								d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.09-.16-.26-.25-.44-.25-.06 0-.12.01-.17.03l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.06-.02-.12-.03-.18-.03-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.09.16.26.25.44.25.06 0 .12-.01.17-.03l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.06.02.12.03.18.03.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-1.98-1.71c.04.31.05.52.05.73 0 .21-.02.43-.05.73l-.14 1.13.89.7 1.08.84-.7 1.21-1.27-.51-1.04-.42-.9.68c-.43.32-.84.56-1.25.73l-1.06.43-.16 1.13-.2 1.35h-1.4l-.19-1.35-.16-1.13-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7-1.06.43-1.27.51-.7-1.21 1.08-.84.89-.7-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13-.89-.7-1.08-.84.7-1.21 1.27.51 1.04.42.9-.68c.43-.32.84-.56 1.25-.73l1.06-.43.16-1.13.2-1.35h1.39l.19 1.35.16 1.13 1.06.43c.43.18.83.41 1.23.71l.91.7 1.06-.43 1.27-.51.7 1.21-1.07.85-.89.7.14 1.13zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
							/>
						</Svg>
					</button>
				</div>
			</div>
			<div
				class="overlay"
				transition:fade={{ duration: 350 }}
				on:click={() => (menuOpen = !menuOpen)}
				on:keypress={() => (menuOpen = !menuOpen)}
			/>
		</div>
	{/if}
</nav>

<!-- settings -->
<Modal bind:modalOpen>
	<svelte:fragment slot="title">Settings</svelte:fragment>
	<svelte:fragment slot="description">Configure the website's API. Defaults to ReVanced.</svelte:fragment>
	<div id="settings-content">
		<div class="input-wrapper">
			<input name="api-url" type="text" bind:value={url} />
			<button id="button-reset" on:click={reset}>
				<Svg viewBoxHeight={48} svgHeight={24}>
					<path
						d="M11.2 36.725C14.6667 40.2417 18.8833 42 23.85 42C26.35 42 28.7 41.525 30.9 40.575C33.1 39.625 35.025 38.3333 36.675 36.7C38.325 35.0667 39.625 33.15 40.575 30.95C41.525 28.75 42 26.4 42 23.9C42 21.4 41.525 19.0667 40.575 16.9C39.625 14.7333 38.325 12.8417 36.675 11.225C35.025 9.60833 33.1 8.33333 30.9 7.4C28.7 6.46667 26.35 6 23.85 6C21.1833 6 18.6583 6.58333 16.275 7.75C13.8917 8.91667 11.8333 10.5167 10.1 12.55V7.25H7.1V17.65H17.55V14.65H12.3C13.7667 12.95 15.4917 11.5833 17.475 10.55C19.4583 9.51667 21.5833 9 23.85 9C28.0167 9 31.5833 10.425 34.55 13.275C37.5167 16.125 39 19.6167 39 23.75C39 27.9833 37.5333 31.5833 34.6 34.55C31.6667 37.5167 28.0833 39 23.85 39C19.6833 39 16.1667 37.5333 13.3 34.6C10.4333 31.6667 9 28.1167 9 23.95H6C6 28.95 7.73333 33.2083 11.2 36.725Z"
					/>
				</Svg>
			</button>
		</div>
		<div class="buttons">
			<Button kind="tertiary" on:click={clear_and_reload}>Clear cache</Button>
			<Button kind="tertiary" on:click={save}>Save</Button>
		</div>
	</div>
</Modal>

<style>
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

	.buttons {
		display: flex;
		justify-content: flex-end;
		gap: 2rem;
		margin-top: 2rem;
	}

	input {
		width: 100%;
		padding-right: 3rem;
	}

	#button-reset {
		position: absolute;
		right: 12px;
		top: 14px;
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

	.nav-wrapper {
		display: flex;
		width: 100%;
		justify-content: space-between;
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
		box-shadow: 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12),
			0px 2px 4px -1px rgba(0, 0, 0, 0.2);
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

	.desktop {
		width: 100%;
		justify-content: space-between;
		align-items: center;
		display: flex;
	}

	@media (max-width: 768px) {
		.desktop {
			display: none;
		}

		nav {
			justify-content: normal;
		}

		.nav-wrapper {
			flex-direction: column;
			gap: 0.5rem;
			height: 100vh;
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

	/* Hamburger mmm yum */
	@media screen and (min-width: 768px) {
		.mobile {
			display: none !important;
		}
	}
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
</style>
