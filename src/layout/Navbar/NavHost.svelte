<script lang="ts">
	import { onMount } from 'svelte';
	import { horizontalSlide } from '$util/horizontalSlide';
	import { fade } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import { createQuery } from '@tanstack/svelte-query';

	import Navigation from './NavButton.svelte';
	import Query from '$lib/components/Query.svelte';
	import AnnouncementBanner from '../../routes/announcements/AnnouncementBanner.svelte';

	import Cog from 'svelte-material-icons/Cog.svelte';

	import { status_url } from '$data/api/settings';
	import RouterEvents from '$data/RouterEvents';
	import { queries } from '$data/api';

	import StatusBanner from './StatusBanner.svelte';
	import SettingsModal from './Modals/SettingsModal.svelte';
	import LoginModal from './Modals/LoginModal.svelte';
	import LoginSuccessfulModal from './Modals/LoginSuccessfulModal.svelte';
	import SessionExpiredModal from './Modals/SessionExpiredModal.svelte';

	const ping = createQuery(queries.ping());
	const statusUrl = status_url();

	let menuOpen = false;
	const modals: Record<string, boolean> = {
		settings: false,
		login: false
	};

	let scrollY: number;

	onMount(() => {
		return RouterEvents.subscribe((event) => {
			if (event.navigating) menuOpen = false;
		});
	});
</script>

<svelte:window bind:scrollY />

<span class="banner" class:hide={menuOpen}>
	<Query query={ping} let:data>
		{#if !data}
			<StatusBanner {statusUrl} />
		{/if}
	</Query>
	<AnnouncementBanner />
</span>

<nav class:scrolled={scrollY > 10}>
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
			id="nav-wrapper-container"
			class:desktop-only={!menuOpen}
			transition:horizontalSlide={{ direction: 'inline', easing: expoOut, duration: 400 }}
		>
			<div class="nav-wrapper">
				<div id="main-navigation">
					<ul class="nav-buttons">
						<Navigation href="/" label="Home">Home</Navigation>
						<Navigation queryKey="manager" href="/download" label="Download">Download</Navigation>
						<Navigation queryKey="patches" href="/patches" label="Patches">Patches</Navigation>
						<Navigation
							queryKey={['announcements', 'announcementTags']}
							href="/announcements"
							label="Announcements"
						>
							Announcements
						</Navigation>
						<Navigation queryKey="contributors" href="/contributors" label="Contributors">
							Contributors
						</Navigation>
						<Navigation queryKey={['about', 'team']} href="/donate" label="Donate"
							>Donate</Navigation
						>
					</ul>
				</div>
				<div id="secondary-navigation">
					<button on:click={() => (modals.settings = !modals.settings)} aria-label="Settings">
						<Cog size="20px" color="var(--surface-six)" />
					</button>
				</div>
			</div>
		</div>
	{/key}

	{#if menuOpen}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="overlay mobile-only"
			transition:fade={{ duration: 350 }}
			on:click={() => (menuOpen = !menuOpen)}
			on:keypress={() => (menuOpen = !menuOpen)}
		/>
	{/if}
</nav>

<SettingsModal bind:modalOpen={modals.settings} bind:loginOpen={modals.login} />

<LoginModal bind:modalOpen={modals.login} />

<LoginSuccessfulModal />

<SessionExpiredModal bind:loginOpen={modals.login} />

<style lang="scss">
	#logo {
		padding: 0.5rem;
	}

	button {
		background-color: transparent;
		border: none;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	nav {
		position: sticky;
		top: 0;
		z-index: 5;

		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;

		height: 70px;
		padding: 1rem 2rem;
		width: 100%;

		background-color: var(--surface-eight);
	}

	#main-navigation,
	#secondary-navigation {
		align-items: center;
		display: flex;
		gap: 2rem;
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
		z-index: 3;
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

	.banner.hide {
		display: none;
	}

	#nav-wrapper-container {
		width: 100%;
	}

	@media (max-width: 767px) {
		#nav-wrapper-container {
			overflow: hidden;
			position: fixed;
			width: 20rem;
			top: 0;
			left: 0;
			height: 100%;
			background-color: var(--surface-eight);
			z-index: 4;
		}

		.nav-wrapper {
			flex-direction: column;
			gap: 0.5rem;
			height: 100%;
			margin: 0 auto;
			width: 20rem;
			border-radius: 0px 24px 24px 0px;
			padding: 1rem;
			padding-top: 6rem;
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
			z-index: 4;
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
		z-index: 6;
		justify-content: center;
		align-items: center;
		cursor: pointer;

		&__burger {
			display: flex;
			flex-wrap: wrap;

			&,
			&::before,
			&::after {
				width: 24px;
				height: 2px;
				background: var(--surface-six);
				transition: all 0.3s var(--bezier-one);
			}

			&::before,
			&::after {
				content: '';
				position: absolute;
			}

			&::before {
				transform: translateY(-6.5px);
			}

			&::after {
				transform: translateY(6.5px);
			}
		}

		/* ANIMATION */
		&.open {
			.menu-btn__burger {
				transform: translateX(-10px);
				background: transparent;
				box-shadow: none;

				&::before {
					transform: rotate(45deg) translate(10px, -10px);
				}

				&::after {
					transform: rotate(-45deg) translate(10px, 10px);
				}
			}
		}
	}

	.skiptab-btn {
		position: fixed;
		left: -300px;
		border-radius: 100px;
		text-decoration: none;
		background-color: var(--primary);
		z-index: 2;
		color: var(--text-three);
		font-weight: 600;
		font-size: 0.95rem;
		padding: 16px 24px;

		&:focus {
			left: 12px;
		}
	}
</style>
