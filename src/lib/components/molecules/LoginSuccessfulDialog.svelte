<script lang="ts">
import Modal from './Modal.svelte';
import Button from '../atoms/Button.svelte';
import { auth } from '$stores';

let open = $state(false);

function fromNow(timestamp: number): string {
const now = Date.now();
const diff = timestamp - now;
if (diff <= 0) return 'expired';

const diffMins = Math.floor(diff / 6e4);
const diffHours = Math.floor(diff / 36e5);
const diffDays = Math.floor(diff / 864e5);

if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''}`;
return 'a few seconds';
}

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
