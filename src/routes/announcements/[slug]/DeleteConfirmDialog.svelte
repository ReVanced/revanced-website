<script lang="ts">
	import Button from '$components/atoms/Button.svelte';
	import Modal from '$components/molecules/Modal.svelte';

	type Props = {
		open: boolean;
		onConfirm: () => void;
		onCancel: () => void;
	};

	let {
		open = $bindable(),
		onConfirm,
		onCancel
	}: Props = $props();

	function handleConfirm() {
		onConfirm();
	}

	function handleCancel() {
		open = false;
		onCancel();
	}
</script>

<Modal
	bind:open
	title="Confirm?"
	onclose={handleCancel}
>
	{#snippet description()}
		Do you want to delete this announcement?
	{/snippet}

	{#snippet buttons()}
		<Button buttonStyle="text" onclick={handleCancel}>No</Button>
		<Button buttonStyle="filled" onclick={handleConfirm}>Yes</Button>
	{/snippet}
</Modal>
