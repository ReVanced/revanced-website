<script lang="ts">
	import { login } from '$lib/auth';

	import Input from '$ui/Input.svelte';
	import Button from '$ui/Button.svelte';
	import Dialog from '$layout/dialogs/Dialog.svelte';
	import { passed_login_with_creds } from '$lib/stores.svelte';

	let {
		dialogOpen = $bindable(false)
	}: {
		dialogOpen?: boolean;
	} = $props();

	let loginForm = $state() as HTMLFormElement;
	let wrong_credentials = $state(false);
	let loading = $state(false);

	async function handle_login(e: SubmitEvent) {
		if (loading) return;
		loading = true;
		
		const data = new FormData(e.target as HTMLFormElement);

		const username = data.get('username') as string;
		const password = data.get('password') as string;

		const success = await login(username, password);

		loading = false;
		dialogOpen = !success;
		passed_login_with_creds.value = success;
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
		<form onsubmit={(e) => { e.preventDefault(); handle_login(e); }} bind:this={loginForm}>
			<div class="inputs">
				<Input placeholder="Username" required disabled={loading} />
				<Input
					placeholder="Password"
					type="password"
					onkeydown={(event) => event.key === 'Enter' && !loading && loginForm.requestSubmit()}
					required
					disabled={loading}
				/>
			</div>
		</form>
	</div>
	{#snippet buttons()}
		<Button type="text" onclick={() => (dialogOpen = !dialogOpen)} disabled={loading}>Cancel</Button>
		<!-- first paragraph of https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit -->
		<Button type="filled" onclick={() => loginForm.requestSubmit()} disabled={loading}>
			{loading ? 'Logging in...' : 'Login'}
		</Button>
	{/snippet}
</Dialog>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		position: relative;

		h2 {
			color: var(--primary);
		}

		form {
			display: flex;
			gap: 1rem;

			.inputs {
				display: flex;
				flex-direction: column;
				gap: 1rem;
				margin-bottom: 1rem;
				width: 100%;
			}
		}
	}
</style>
