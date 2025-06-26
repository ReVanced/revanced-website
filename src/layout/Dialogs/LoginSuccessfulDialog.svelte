<script lang="ts">
	import { fromNow } from '$util/fromNow';
	import { admin_login, passed_login_with_creds } from '$lib/stores';

	import Button from '$lib/components/Button.svelte';
	import Dialog from '$layout/Dialogs/Dialog.svelte';
</script>

<Dialog bind:dialogOpen={$passed_login_with_creds}>
	<svelte:fragment slot="title">Successfully logged in!</svelte:fragment>
	<div>
		This session will expire in
		<span>{$admin_login.logged_in ? fromNow($admin_login.expires) : '...'}</span>
	</div>
	<svelte:fragment slot="buttons">
		<Button type="filled" on:click={() => passed_login_with_creds.set(false)}>OK</Button>
	</svelte:fragment>
</Dialog>

<style lang="scss">
	div {
		color: var(--text-one);

		span {
			color: var(--primary);
		}
	}
</style>
