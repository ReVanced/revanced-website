<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$layout/dialogs/Dialog.svelte';
	import { allowAnalytics } from '$lib/stores.svelte';
	import { RV_GOOGLE_TAG_MANAGER_ID } from '$data/api/public';

	let showConsentDialog = $state(false);

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
		allowAnalytics.value = allowed;
		showConsentDialog = false;

		if (allowed) enableAnalytics();
	}

	$effect(() => {
		const savedConsent = localStorage.getItem('analytics');

		if (savedConsent !== null) {
			const allowed = savedConsent === 'true';
			allowAnalytics.value = allowed;
			if (allowed) enableAnalytics();
		} else {
			showConsentDialog = true;
		}
	});
</script>

<Dialog bind:dialogOpen={showConsentDialog} notDismissible>
	{#snippet title()}It's your choice{/snippet}
	{#snippet description()}
		We use analytics to improve your experience on this site. By clicking "Allow", you allow us to
		collect anonymous data about your visit.
	{/snippet}
	{#snippet buttons()}
		<Button type="text" onclick={() => handleConsent(false)}>Deny</Button>
		<Button type="filled" onclick={() => handleConsent(true)}>Allow</Button>
	{/snippet}
</Dialog>
