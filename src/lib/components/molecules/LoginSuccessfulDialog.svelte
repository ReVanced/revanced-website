<script lang="ts">
import { fromNow } from '$lib/utils/relativeTime';
import Modal from './Modal.svelte';
import Button from '../atoms/Button.svelte';
import { auth } from '$stores';

let open = $state(false);

$effect(() => {
if (auth.loginSuccess) {
open = true;
const timer = setTimeout(() => {
auth.clearLoginSuccess();
}, 100);
return () => clearTimeout(timer);
}
});

function handleClose() {
open = false;
auth.clearLoginSuccess();
}
</script>

{#if open}
<Modal title="Successfully logged in!" bind:open>
<div>
This session will expire in
<span>{auth.expiry ? fromNow(auth.expiry) : '...'}</span>
</div>
{#snippet buttons()}
<Button buttonStyle="filled" onclick={handleClose}>OK</Button>
{/snippet}
</Modal>
{/if}

<style>
div {
color: var(--text-one);
}

div span {
color: var(--primary);
}
</style>
