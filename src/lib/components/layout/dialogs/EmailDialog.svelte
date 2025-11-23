<script lang="ts">
	import Divider from '$ui/Divider.svelte';
	import { email } from '$data/api/settings';
	import Dialog from '$layout/dialogs/Dialog.svelte';
	import Button from '$ui/Button.svelte';
	import Input from '$ui/Input.svelte';

	let {
		showEmailDialog = $bindable(false)
	}: {
		showEmailDialog?: boolean;
	} = $props();

	let enableInputSeconds = $state(15);
	let keyword: string = $state('');

	let interval: ReturnType<typeof setInterval> | undefined;
	function closeDialog() {
		showEmailDialog = false;
		clearInterval(interval);
		interval = undefined;
		enableInputSeconds = 15;
		keyword = '';
	}

	$effect(() => {
		if (showEmailDialog && !interval && enableInputSeconds != 0) {
			interval = setInterval(() => {
				if (enableInputSeconds <= 0) {
					clearInterval(interval);
					return;
				}
				enableInputSeconds -= 1;
			}, 1000);
		}
	});
</script>

<Dialog bind:dialogOpen={showEmailDialog} notDismissible>
	{#snippet title()}Abuse notice{/snippet}
	{#snippet description()}
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
	{/snippet}
	{#snippet buttons()}
		{#if keyword.toLowerCase() === 'reficio'}
			<Button type="text"><a href="mailto:{email()}">Send</a></Button>
		{/if}
		<Button type="filled" onclick={closeDialog}>Close</Button>
	{/snippet}
</Dialog>

<style>
	a {
		text-decoration: none;
		color: var(--text-four);
		font-weight: 600;
	}
</style>
