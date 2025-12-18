<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';

	import favicon from '$assets/icons/favicon.ico';
	import ApiStatusBanner from '$components/molecules/ApiStatusBanner.svelte';
	import AnnouncementBanner from '$components/molecules/AnnouncementBanner.svelte';
	import NavBar from '$components/organisms/NavBar.svelte';
	import Footer from '$components/organisms/Footer.svelte';
	import ModalBackground from '$components/atoms/ModalBackground.svelte';
	import LoadingSpinner from '$components/atoms/LoadingSpinner.svelte';
	import ConsentDialog from '$components/molecules/ConsentDialog.svelte';
	import EmailVerificationDialog from '$components/molecules/EmailVerificationDialog.svelte';
	import SessionExpiredDialog from '$components/molecules/SessionExpiredDialog.svelte';
	import LoginSuccessfulDialog from '$components/molecules/LoginSuccessfulDialog.svelte';
	import type { WithChildren } from '$types';
	import {
		theme,
		aboutQuery,
		initializeAllQueries,
		refetchAllQueries,
		startRefreshInterval,
		stopRefreshInterval,
		auth
	} from '$stores';
	import { useHolidayTheme } from '$lib/utils/themeEvents';
	import { fetchDynamicSettings } from '$lib/api/settings';

	let { children }: WithChildren = $props();
	useHolidayTheme();
	initializeAllQueries();
	
	let showSpinner = $state(false);
	let spinnerTimeout: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		if ($navigating) {
			spinnerTimeout = setTimeout(() => {
				showSpinner = true;
			}, 250);
		} else {
			if (spinnerTimeout) {
				clearTimeout(spinnerTimeout);
				spinnerTimeout = null;
			}
			showSpinner = false;
		}

		return () => {
			if (spinnerTimeout) {
				clearTimeout(spinnerTimeout);
			}
		};
	});

	const pageLinks = [
		{ label: 'Home', href: '/' },
		{ label: 'Download', href: '/download' },
		{ label: 'Patches', href: '/patches' },
		{ label: 'Contributors', href: '/contributors' },
		{ label: 'Donate', href: '/donate' }
	];

	let aboutText = $derived(aboutQuery.data?.about ?? '');
	let socials = $derived(aboutQuery.data?.socials ?? []);
	let contactEmail = $derived(aboutQuery.data?.contact?.email ?? '');

	let emailDialogOpen = $state(false);

	function handleEmailClick() {
		emailDialogOpen = true;
	}

	onMount(() => {
		auth.startChecking();
		fetchDynamicSettings();
		startRefreshInterval(refetchAllQueries);

		return () => {
			auth.stopChecking();
			stopRefreshInterval();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<svelte:document
	{@attach (document) => {
		document.documentElement.setAttribute('data-theme', theme.current);
	}}
/>

<div class="banner-wrapper">
	<ApiStatusBanner />
	<AnnouncementBanner />
</div>

{#if showSpinner}
	<LoadingSpinner />
{/if}

<NavBar />

<ModalBackground />

<ConsentDialog />

<main id="main-content">
	{@render children()}
</main>

<Footer
	about={aboutText}
	{pageLinks}
	{socials}
	{contactEmail}
	onEmailClick={handleEmailClick}
/>

<EmailVerificationDialog bind:open={emailDialogOpen} email={contactEmail} />

<SessionExpiredDialog />

<LoginSuccessfulDialog />

<style>
	.banner-wrapper {
		position: relative;
		z-index: var(--z-toast);
	}
</style>