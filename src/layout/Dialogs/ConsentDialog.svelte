<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$layout/Dialogs/Dialog.svelte';
	import { onMount } from 'svelte';
	import { allowAnalytics } from '$lib/stores';
	import { RV_GOOGLE_TAG_MANAGER_ID } from '$env/static/public';

	let showConsentDialog = false;

	function enableAnalytics() {
		//@ts-ignore
		window.dataLayer = [
			{
				'gtm.start': new Date().getTime(),
				event: 'gtm.js'
			}
		];

		var firstScript = document.getElementsByTagName('script')[0];
		var script = document.createElement('script');
		script.async = true;
		script.src = 'https://www.googletagmanager.com/gtm.js?id=' + RV_GOOGLE_TAG_MANAGER_ID;
		
		//@ts-ignore
		firstScript.parentNode.insertBefore(script, firstScript);
	}

	function handleConsent(allowed: boolean) {
		localStorage.setItem('analytics', allowed.toString());
		allowAnalytics.set(allowed);
		showConsentDialog = false;

		if (allowed) enableAnalytics();
	}

	onMount(() => {
		const savedConsent = localStorage.getItem('analytics');

		if (savedConsent !== null) {
			const allowed = savedConsent === 'true';
			allowAnalytics.set(allowed);
			if (allowed) enableAnalytics();
		} else {
			showConsentDialog = true;
		}
	});
</script>

<Dialog bind:dialogOpen={showConsentDialog} notDismissible>
	<svelte:fragment slot="title">It's your choice</svelte:fragment>
	<svelte:fragment slot="description">
		We use analytics to improve your experience on this site. By clicking "Allow", you allow us to
		collect anonymous data about your visit.
	</svelte:fragment>
	<svelte:fragment slot="buttons">
		<Button type="text" on:click={() => handleConsent(false)}>Deny</Button>
		<Button type="filled" on:click={() => handleConsent(true)}>Allow</Button>
	</svelte:fragment>
</Dialog>
