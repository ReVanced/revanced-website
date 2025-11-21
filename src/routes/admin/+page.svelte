<script lang="ts">
	import { fromNow } from '$util/fromNow';
	import { admin_login } from '$lib/stores';
	import { api_base_url, set_api_base_url, default_api_url } from '$data/api/settings';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import Button from '$lib/components/Button.svelte';
	import LoginDialog from '$layout/Dialogs/LoginDialog.svelte';
	import LoginSuccessfulDialog from '$layout/Dialogs/LoginSuccessfulDialog.svelte';
	import SessionExpiredDialog from '$layout/Dialogs/SessionExpiredDialog.svelte';
	import Replay from 'svelte-material-icons/Replay.svelte';

	const client = useQueryClient();

	let url = api_base_url();
	let loginOpen = false;

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

	onMount(() => {
		if (!$admin_login.logged_in) {
			loginOpen = true;
		}
	});
</script>

<svelte:head>
	<title>Admin Panel - ReVanced</title>
</svelte:head>

<main>
	<h1>Admin Panel</h1>
	{#if $admin_login.logged_in}
		<p>Configure the API for this website.</p>
		<div class="input-wrapper">
			<input name="api-url" id="api-url" type="text" bind:value={url} />
			<button id="button-reset" on:click={reset} aria-label="Reset Button">
				<Replay size="24px" color="var(--surface-six)" />
			</button>
		</div>
		<div class="buttons-container">
			<Button
				type="text"
				disabled={$admin_login.logged_in}
				on:click={() => (loginOpen = !loginOpen)}
			>
				{$admin_login.logged_in ? `Logged in for ${fromNow($admin_login.expires)}` : 'Login'}
			</Button>
			<div class="buttons">
				<Button type="text" on:click={clear_and_reload} label="Reset Button">Reset</Button>
				<Button type="text" on:click={save} label="Save Button">Save</Button>
			</div>
		</div>
	{:else}
		<p>Please log in to access the admin panel.</p>
	{/if}
</main>

<LoginDialog bind:dialogOpen={loginOpen} />
<LoginSuccessfulDialog />
<SessionExpiredDialog bind:loginOpen />

<style>
	main {
		padding: 2rem;
		max-width: 800px;
		margin: 0 auto;
	}

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