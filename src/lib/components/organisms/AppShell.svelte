<script lang="ts">
	import { navigating } from '$app/state';

	import ApiStatusBanner from '$components/organisms/ApiStatusBanner.svelte';
	import AnnouncementBanner from '$components/organisms/AnnouncementBanner.svelte';
	import NavBar from '$components/organisms/NavBar.svelte';
	import Footer from '$components/organisms/Footer.svelte';
	import ModalBackground from '$components/organisms/ModalBackground.svelte';
	import ConsentDialog from '$components/organisms/ConsentDialog.svelte';
	import EmailVerificationDialog from '$components/molecules/EmailVerificationDialog.svelte';
	import SessionExpiredDialog from '$components/organisms/SessionExpiredDialog.svelte';
	import LoginSuccessfulDialog from '$components/organisms/LoginSuccessfulDialog.svelte';
	import Spinner from '$components/atoms/Spinner.svelte';
	import type { WithChildren } from '$types';
	import type { About, Announcement } from '$lib/api/types';
	import {
		auth,
		modalsStack
	} from '$stores';
	import { populateDynamicSettings } from '$lib/api/settings';

	let { children, about = null, announcements = [] }: WithChildren & {
		about: About | null;
		announcements: Announcement[];
	} = $props();

	const pageLinks = [
		{ label: 'Home', href: '/' },
		{ label: 'Download', href: '/download' },
		{ label: 'Contributors', href: '/contributors' },
		{ label: 'Donate', href: '/donate' }
	];

	let aboutText = $derived(about?.about ?? '');
	let socials = $derived(about?.socials ?? []);
	let contactEmail = $derived(about?.contact?.email ?? '');
	let apiIsDown = $derived(about === null);

	let emailDialogOpen = $state(false);
	let showLoadingSpinner = $state(false);
	let hasModals = $derived(modalsStack.hasModals());

	$effect(() => {
		if (about) {
			populateDynamicSettings(about);
		}
	});

	$effect(() => {
		const isNavigating = navigating.to !== null;
		let timeoutId: ReturnType<typeof setTimeout> | undefined;

		if (isNavigating) {
			timeoutId = setTimeout(() => {
				showLoadingSpinner = true;
			}, 250);
		} else {
			showLoadingSpinner = false;
		}

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	});

	function handleEmailClick() {
		emailDialogOpen = true;
	}

	$effect(() => {
		auth.startChecking();

		return () => {
			auth.stopChecking();
		};
	});
</script>

<div class="banner-wrapper" inert={hasModals ? true : undefined}>
	<ApiStatusBanner {apiIsDown} />
	<AnnouncementBanner {announcements} />
</div>

<NavBar inert={hasModals} />

<ModalBackground />

<ConsentDialog />

<main id="main-content" inert={hasModals ? true : undefined}>
	{#if showLoadingSpinner}
		<Spinner />
	{:else}
		{@render children()}
	{/if}
</main>

<div id="modal-portal"></div>

<Footer
	about={aboutText}
	{pageLinks}
	{socials}
	{contactEmail}
	onEmailClick={handleEmailClick}
	inert={hasModals}
/>

<EmailVerificationDialog bind:open={emailDialogOpen} email={contactEmail} />

<SessionExpiredDialog />

<LoginSuccessfulDialog />

<style>
	.banner-wrapper {
		position: relative;
		z-index: var(--z-dropdown);
	}
</style>
