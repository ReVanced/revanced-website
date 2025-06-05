<script lang="ts">
	import { fromNow } from '$util/fromNow';
	import { admin_login, passed_login_with_creds } from '$lib/stores';

	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Dialogue.svelte';
</script>

<Modal bind:modalOpen={$passed_login_with_creds}>
	<svelte:fragment slot="title">Successfully logged in!</svelte:fragment>
	<div class="login-success">
		This session will expire in
		<span class="exp-date">{$admin_login.logged_in ? fromNow($admin_login.expires) : '...'}</span>
	</div>
	<svelte:fragment slot="buttons">
		<Button type="filled" on:click={() => passed_login_with_creds.set(false)}>OK</Button>
	</svelte:fragment>
</Modal>

<style>
	.login-success {
		color: var(--text-one);
	}

	.exp-date {
		color: var(--primary);
	}
</style>
