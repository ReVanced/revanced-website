<script lang="ts">
	import Divider from '$lib/components/Divider.svelte';
	import { email } from '$data/api/settings';
	import Dialog from '$layout/Dialogs/Dialog.svelte';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';

	export let showEmailDialog: boolean;

	let enableInputSeconds = 15;
	let keyword: string = '';

	let interval: number | undefined;
	function closeDialog() {
		showEmailDialog = false;
		clearInterval(interval);
		interval = undefined;
		enableInputSeconds = 15;
		keyword = '';
	}

	$: if (showEmailDialog && !interval && enableInputSeconds != 0) {
		interval = setInterval(() => {
			if (enableInputSeconds <= 0) {
				clearInterval(interval);
				return;
			}
			enableInputSeconds -= 1;
		}, 1000);
	}
</script>

<Dialog bind:dialogOpen={showEmailDialog} notDismissible>
	<svelte:fragment slot="title">Abuse notice</svelte:fragment>
	<svelte:fragment slot="description">
		<p>
			This E-Mail address is <b>not</b> for support, help, bug reports or feature requests. It must
			have a subject and body and have the keyword <span style="user-select: none;">'Reficio'</span>
			in either, otherwise your mail will be
			<b>ignored</b>.
		</p>
		<br />
		{#if enableInputSeconds == 0}
			<span>Enter the keyword, then click "Send".</span>
			<br />
			<br />
			<Input placeholder="Keyword" type="text" bind:value={keyword}></Input>
		{:else}
			<span>Read above and wait <b>{enableInputSeconds}</b> seconds.</span>
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="buttons">
		{#if keyword.toLowerCase() === 'reficio'}
			<Button type="text"><a href="mailto:{email()}">Send</a></Button>
		{/if}
		<Button type="filled" on:click={closeDialog}>Close</Button>
	</svelte:fragment>
</Dialog>

<style>
	a {
		text-decoration: none;
		color: var(--text-four);
		font-weight: 600;
	}
</style>
