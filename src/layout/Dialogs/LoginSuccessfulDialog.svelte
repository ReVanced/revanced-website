<script lang="ts">
	import { fromNow } from '$util/fromNow';
	import { admin_login, passed_login_with_creds } from '$lib/stores.svelte';

	import Button from '$lib/components/Button.svelte';
	import Dialog from '$layout/dialogs/Dialog.svelte';
</script>

<Dialog bind:dialogOpen={passed_login_with_creds.value}>
	{#snippet title()}Successfully logged in!{/snippet}
	<div>
		This session will expire in
		<span>{admin_login.value.logged_in ? fromNow(admin_login.value.expires) : '...'}</span>
	</div>
	{#snippet buttons()}
		<Button type="filled" onclick={() => (passed_login_with_creds.value = false)}>OK</Button>
	{/snippet}
</Dialog>

<style lang="scss">
	div {
		color: var(--text-one);

		span {
			color: var(--primary);
		}
	}
</style>
