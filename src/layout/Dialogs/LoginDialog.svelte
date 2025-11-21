<script lang="ts">
	import { login } from '$lib/auth';

	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$layout/Dialogs/Dialog.svelte';
	import { passed_login_with_creds } from '$lib/stores';

	export let dialogOpen: boolean;

	let loginForm: HTMLFormElement;
	let wrong_credentials = false;

	async function handle_login(e: SubmitEvent) {
		const data = new FormData(e.target as HTMLFormElement);

		const username = data.get('username') as string;
		const password = data.get('password') as string;

		const success = await login(username, password);

		dialogOpen = !success;
		passed_login_with_creds.set(success);
		wrong_credentials = !success;
	}
</script>

<Dialog bind:dialogOpen>
	<div class="container">
		<h2>Login</h2>
		<p>This login is reserved for site administrators. Go back!</p>
		{#if wrong_credentials}
			<p style="color: var(--red-one)">Username or password do not match. Try again.</p>
		{/if}
		<form on:submit|preventDefault={handle_login} bind:this={loginForm}>
			<div class="inputs">
				<Input placeholder="Username" required />
				<Input
					placeholder="Password"
					type="password"
					onkeydown={(event) => event.key === 'Enter' && loginForm.requestSubmit()}
					required
				/>
			</div>
		</form>
	</div>
	<svelte:fragment slot="buttons">
		<Button type="text" on:click={() => (dialogOpen = !dialogOpen)}>Cancel</Button>
		<!-- first paragraph of https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit -->
		<Button type="filled" on:click={() => loginForm.requestSubmit()}>Login</Button>
	</svelte:fragment>
</Dialog>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		position: relative;
	}

	.container h2 {
		color: var(--primary);
	}

	.container form {
		display: flex;
		gap: 1rem;
	}

	.inputs {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
