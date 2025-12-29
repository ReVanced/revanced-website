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

function formatExpiryPrecise(expiry: number | null): string {
	if (!expiry) return '...';
	const now = Date.now();
	const diff = expiry - now;
	if (diff <= 0) return 'now';
	const minutes = Math.floor(diff / (1000 * 60));
	if (minutes < 60) {
		return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
	}
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	if (remainingMinutes > 0) {
		return `${hours}h ${remainingMinutes}m`;
	}
	return `${hours} hour${hours !== 1 ? 's' : ''}`;
}
</script>

<Modal title="Successfully logged in!" bind:open>
<div>
This session will expire in
<span>{formatExpiryPrecise(auth.expiry)}</span>
</div>
{#snippet buttons()}
<Button buttonStyle="filled" onclick={handleClose}>OK</Button>
{/snippet}
</Modal>

<style>
div {
color: var(--text-one);
}

div span {
color: var(--primary);
}
</style>
