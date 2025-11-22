<script lang="ts">
	import { fromNow } from '$util/fromNow';
	import { admin_login } from '$lib/stores.svelte';
	import { api_base_url, set_api_base_url, default_api_url } from '$data/api/settings';
	import { useQueryClient } from '@tanstack/svelte-query';

	import Button from '$lib/components/Button.svelte';
	import Dialog from '$layout/dialogs/Dialog.svelte';
	import Replay from 'svelte-material-icons/Replay.svelte';
	import Cog from 'svelte-material-icons/Cog.svelte';

	let {
		loginOpen = $bindable(false),
		dialogOpen = $bindable(false)
	}: {
		loginOpen?: boolean;
		dialogOpen?: boolean;
	} = $props();

	const client = useQueryClient();

	let url = $state(api_base_url());

	function reload() {
		location.reload();
	}

	function clear_and_reload() {
		client.clear();
		// `client.clear()` does technically do this for us, but it takes a while.
		localStorage.clear();

		reload();
	}

	function save() {
		set_api_base_url(url);
		reload();
	}

	function reset() {
		url = default_api_url;
	}
</script>

<Dialog bind:dialogOpen>
	{#snippet icon()}
		<Cog size="24px" color="var(--surface-six)" />
	{/snippet}
	{#snippet title()}Settings{/snippet}
	<div id="settings-content">
		<p>Configure the API for this website.</p>
		<div class="input-wrapper">
			<input name="api-url" id="api-url" type="text" bind:value={url} />
			<button id="button-reset" onclick={reset} aria-label="Reset Button">
				<Replay size="24px" color="var(--surface-six)" />
			</button>
		</div>
	</div>

	{#snippet buttons()}
		<div class="buttons-container">
			<Button
				type="text"
				disabled={admin_login.value.logged_in}
				onclick={() => ((loginOpen = !loginOpen), (dialogOpen = !dialogOpen))}
			>
				{admin_login.value.logged_in ? `Logged in for ${fromNow(admin_login.value.expires)}` : 'Login'}
			</Button>
			<div class="buttons">
				<Button type="text" onclick={clear_and_reload} label="Reset Button">Reset</Button>
				<Button type="text" onclick={save} label="Save Button">Save</Button>
			</div>
		</div>
	{/snippet}
</Dialog>

<style lang="scss">
	input {
		width: 100%;
		position: relative;
		padding-right: 3rem;
		margin-top: 1rem;
	}

	#button-reset {
		position: absolute;
		right: 12px;
		top: 30px;
	}

	button {
		background-color: transparent;
		border: none;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.input-wrapper {
		margin-bottom: 0.75rem;
		display: flex;
		justify-content: space-between;
		position: relative;
	}

	.buttons-container {
		width: 100%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;

		.buttons {
			display: flex;
			justify-content: flex-end;
			flex-wrap: wrap;
			gap: 2rem;
		}
	}
</style>
