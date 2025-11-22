<script lang="ts">
	import { set_access_token } from '$lib/auth';
	import { admin_login } from '$lib/stores.svelte';

	import Button from '$lib/components/Button.svelte';
	import Dialog from '$layout/dialogs/Dialog.svelte';

	let {
		loginOpen = $bindable(false)
	}: {
		loginOpen?: boolean;
	} = $props();

	let session_expired = $derived(admin_login.value.logged_in_previously && !admin_login.value.logged_in);

	function reset_session() {
		set_access_token();
	}
</script>

<Dialog dialogOpen={session_expired}>
	{#snippet title()}Expired session{/snippet}
	<div>
		This session has expired, log in again to renew or lose all access to administrative power.
	</div>
	{#snippet buttons()}
		<Button type="text" onclick={reset_session}>OK</Button>
		<Button type="filled" onclick={() => (reset_session(), (loginOpen = !loginOpen))}>
			Login
		</Button>
	{/snippet}
</Dialog>

<style>
	div {
		color: var(--text-four);
	}
</style>
