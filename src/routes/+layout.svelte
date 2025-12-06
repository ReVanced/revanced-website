<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';

	import favicon from '$assets/icons/favicon.ico';
	import ApiStatusBanner from '$components/molecules/ApiStatusBanner.svelte';
	import NavBar from '$components/organisms/NavBar.svelte';
	import Footer from '$components/organisms/Footer.svelte';
	import ModalBackground from '$components/atoms/ModalBackground.svelte';
	import ConsentDialog from '$components/molecules/ConsentDialog.svelte';
	import EmailVerificationDialog from '$components/molecules/EmailVerificationDialog.svelte';
	import type { WithChildren } from '$types';
	import {
		theme,
		aboutQuery,
		startRefreshInterval,
		stopRefreshInterval,
		refetchAllQueries
	} from '$stores';
	import { PUBLIC_RV_DMCA_GUID } from '$env/static/public';

	let { children }: WithChildren = $props();

	const pageLinks = [
		{ label: 'Home', href: '/' },
		{ label: 'Download', href: '/download' },
		{ label: 'Patches', href: '/patches' },
		{ label: 'Contributors', href: '/contributors' },
		{ label: 'Donate', href: '/donate' }
	];

	const dmcaGuid = PUBLIC_RV_DMCA_GUID;

	let aboutText = $derived(aboutQuery.data?.about ?? '');
	let socials = $derived(aboutQuery.data?.socials ?? []);
	let contactEmail = $derived(aboutQuery.data?.contact?.email ?? '');

	let emailDialogOpen = $state(false);

	function handleEmailClick() {
		emailDialogOpen = true;
	}

	onMount(() => {
		startRefreshInterval(() => {
			refetchAllQueries();
		});

		return () => {
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

<ApiStatusBanner />

<NavBar />

<ModalBackground />

<ConsentDialog />

{@render children()}

<Footer
	about={aboutText}
	{pageLinks}
	{socials}
	{contactEmail}
	{dmcaGuid}
	onEmailClick={handleEmailClick}
/>

<EmailVerificationDialog bind:open={emailDialogOpen} email={contactEmail} />
