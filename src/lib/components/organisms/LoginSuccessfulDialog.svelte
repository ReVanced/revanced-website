<script lang="ts">
import Modal from '$components/molecules/Modal.svelte';
import Button from '$components/atoms/Button.svelte';
import { auth } from '$stores';

let open = $state(false);

$effect(() => {
if (auth.loginSuccess) {
open = true;
}
});

function handleClose() {
open = false;
auth.clearLoginSuccess();
}
</script>

<Modal title="Successfully logged in!" bind:open>
<div>
Token added to local storage.
</div>
{#snippet buttons()}
<Button buttonStyle="filled" onclick={handleClose}>OK</Button>
{/snippet}
</Modal>

<style>
div {
color: var(--text-one);
}
</style>
