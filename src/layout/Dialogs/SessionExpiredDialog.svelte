<script lang="ts">
	import { set_access_token } from '$lib/auth';
	import { admin_login } from '$lib/stores';

	import Button from '$lib/components/Button.svelte';
	import Dialog from '$layout/Dialogs/Dialog.svelte';

	export let loginOpen: boolean;

	$: session_expired = $admin_login.logged_in_previously && !$admin_login.logged_in;

	function reset_session() {
		set_access_token();
		session_expired = !session_expired;
	}
</script>

<Dialog dialogOpen={session_expired}>
	<svelte:fragment slot="title">Expired session</svelte:fragment>
	<div>
		This session has expired, log in again to renew or lose all access to administrative power.
	</div>
	<svelte:fragment slot="buttons">
		<Button type="text" on:click={reset_session}>OK</Button>
		<Button type="filled" on:click={() => (reset_session(), (loginOpen = !loginOpen))}>
			Login
		</Button>
	</svelte:fragment>
</Dialog>

<style>
	div {
		color: var(--text-four);
	}
</style>
