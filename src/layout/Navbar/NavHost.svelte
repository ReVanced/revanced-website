<script lang="ts">
	import { onMount } from 'svelte';
	import { horizontalSlide } from '$util/horizontalSlide';
	import { fade } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';

	import Navigation from './NavButton.svelte';
	import Modal from '$lib/components/Dialogue.svelte';
	import Button from '$lib/components/Button.svelte';

	import Cog from 'svelte-material-icons/Cog.svelte';
	import Replay from 'svelte-material-icons/Replay.svelte';

	import { api_base_url, set_api_base_url, default_api_url } from '$data/api/settings';
	import RouterEvents from '$data/RouterEvents';
	import { admin_login } from '$lib/stores';
	import { fromNow } from '$util/fromNow';

	import { useQueryClient } from '@tanstack/svelte-query';
	import { login, set_access_token } from '$lib/auth';
	import Input from '$lib/components/Input.svelte';

	const client = useQueryClient();

	function reload() {
		location.reload();
	}

	function clear_and_reload() {
		client.clear();
		// `client.clear()` does technically do this for us, but it takes a while.
		localStorage.clear();

		reload();
	}

	let url = api_base_url();

	function save() {
		set_api_base_url(url);
		reload();
	}

	function reset() {
		url = default_api_url;
	}

	let menuOpen = false;
	let modalOpen = false;
	let y: number;
	let loginOpen = false;
	let passed_login_with_creds = false; // will only change when the user INPUTS the credentials, not if the session is just valid
	let wrong_credentials = false;
	$: session_expired = $admin_login.logged_in_previously && !$admin_login.logged_in;
	let loginForm: HTMLFormElement;

	async function handle_login(e: SubmitEvent) {
		const data = new FormData(e.target as HTMLFormElement);

		const username = data.get('username') as string;
		const password = data.get('password') as string;

		const success = await login(username, password);

		loginOpen = !success;
		passed_login_with_creds = success;
		wrong_credentials = !success;
	}

	function reset_session() {
		set_access_token();
		session_expired = !session_expired;
	}

	onMount(() => {
		return RouterEvents.subscribe((event) => {
			if (event.navigating) menuOpen = false;
		});
	});
</script>

<svelte:window bind:scrollY={y} />

<nav class:scrolled={y > 10}>
	<a class="menu-btn skiptab-btn" href="#skiptab">Skip navigation</a>

	<button
		class="menu-btn mobile-only"
		on:click={() => (menuOpen = !menuOpen)}
		class:open={menuOpen}
		aria-label="Menu"
	>
		<span class="menu-btn__burger" />
	</button>
	<a href="/" id="logo"><img src="/logo.svg" alt="ReVanced Logo" /></a>

	{#key menuOpen}
		<div
			class="nav-wrapper"
			class:desktop-only={!menuOpen}
			transition:horizontalSlide={{ direction: 'inline', easing: expoOut, duration: 400 }}
		>
			<div id="main-navigation">
				<ul class="nav-buttons">
					<Navigation href="/" label="Home">Home</Navigation>
					<Navigation queryKey="manager" href="/download" label="Download">Download</Navigation>
					<Navigation queryKey="patches" href="/patches" label="Patches">Patches</Navigation>
					<Navigation
						queryKey={['announcements', 'announcementTags']}
						href="/announcements"
						label="Announcements"
					>
						Announcements
					</Navigation>
					<Navigation queryKey="contributors" href="/contributors" label="Contributors">
						Contributors
					</Navigation>
					<Navigation queryKey={['about', 'team']} href="/donate" label="Donate">Donate</Navigation>
				</ul>
			</div>
			<div id="secondary-navigation">
				<button on:click={() => (modalOpen = !modalOpen)} aria-label="Settings">
					<Cog size="20px" color="var(--surface-six)" />
				</button>
			</div>
		</div>
	{/key}

	{#if menuOpen}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="overlay mobile-only"
			transition:fade={{ duration: 350 }}
			on:click={() => (menuOpen = !menuOpen)}
			on:keypress={() => (menuOpen = !menuOpen)}
		/>
	{/if}
</nav>

<!-- settings -->
<Modal bind:modalOpen>
	<svelte:fragment slot="icon">
		<Cog size="24px" color="var(--surface-six)" />
	</svelte:fragment>
	<svelte:fragment slot="title">Settings</svelte:fragment>
	<div id="settings-content">
		<p>Configure the API for this website.</p>
		<div class="input-wrapper">
			<input name="api-url" id="api-url" type="text" bind:value={url} />
			<button id="button-reset" on:click={reset} aria-label="Reset Button">
				<Replay size="24px" color="var(--surface-six)" />
			</button>
		</div>
	</div>

	<svelte:fragment slot="buttons">
		<div class="buttons-container">
			<Button
				type="text"
				disabled={$admin_login.logged_in}
				on:click={() => ((loginOpen = !loginOpen), (modalOpen = !modalOpen))}
			>
				{$admin_login.logged_in ? `Logged in for ${fromNow($admin_login.expires)}` : 'Login'}
			</Button>
			<div class="buttons">
				<Button type="text" on:click={clear_and_reload} label="Reset Button">Reset</Button>
				<Button type="text" on:click={save} label="Save Button">Save</Button>
			</div>
		</div>
	</svelte:fragment>
</Modal>

<!-- login -->
<Modal bind:modalOpen={loginOpen}>
	<div class="admin-modal-content">
		<h2>Login</h2>
		<p>This login is reserved for site administrators. Go back!</p>
		{#if wrong_credentials}
			<p style="color: var(--red-one)">Username or password do not match. Try again.</p>
		{/if}
		<form on:submit|preventDefault={handle_login} bind:this={loginForm}>
			<div>
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
		<Button type="text" on:click={() => (loginOpen = !loginOpen)}>Cancel</Button>
		<!-- first paragraph of https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit -->
		<Button type="filled" on:click={() => loginForm.requestSubmit()}>Login</Button>
	</svelte:fragment>
</Modal>

<!-- login success -->
<Modal bind:modalOpen={passed_login_with_creds}>
	<svelte:fragment slot="title">Successfully logged in!</svelte:fragment>
	<div class="login-success">
		This session will expire in
		<span class="exp-date">{$admin_login.logged_in ? fromNow($admin_login.expires) : '...'}</span>
	</div>
	<svelte:fragment slot="buttons">
		<Button type="filled" on:click={() => (passed_login_with_creds = false)}>OK</Button>
	</svelte:fragment>
</Modal>

<!-- session expired -->
<Modal modalOpen={session_expired}>
	<svelte:fragment slot="title">Expired session</svelte:fragment>
	<div class="session-expired">
		This session has expired, log in again to renew or lose all access to administrative power.
	</div>
	<svelte:fragment slot="buttons">
		<Button type="text" on:click={reset_session}>OK</Button>
		<Button type="filled" on:click={() => (reset_session(), (loginOpen = !loginOpen))}>
			Login
		</Button>
	</svelte:fragment>
</Modal>

<style lang="scss">
	.buttons-container {
		width: 100%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;

		div {
			display: flex;
			justify-content: flex-end;
			flex-wrap: wrap;
			gap: 2rem;
		}
	}

	.session-expired {
		color: var(--text-four);
	}

	.login-success {
		color: var(--text-one);
	}

	.admin-wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		color: var(--text-one);
	}

	.exp-date {
		color: var(--primary);
	}

	.admin-modal-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		position: relative;
	}

	.admin-modal-content > h2 {
		color: var(--primary);
	}

	.admin-modal-content > form {
		display: flex;
		gap: 1rem;
	}

	.admin-modal-content > form > div:has(input) {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1rem;
		width: 100%;
	}

	.admin-modal-content > form > div:has(svg) {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
	}

	#logo {
		padding: 0.5rem;
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

	nav {
		position: fixed;
		top: 0;
		display: flex;
		gap: 2rem;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		z-index: 666;
		height: 70px;
		background-color: var(--surface-eight);
		width: 100%;
	}

	#main-navigation,
	#secondary-navigation {
		align-items: center;
		display: flex;
		gap: 2rem;
	}

	a {
		display: flex;
	}

	img {
		height: 22px;
	}

	.nav-buttons {
		display: flex;
		gap: 1rem;
	}

	.scrolled {
		box-shadow: var(--drop-shadow-one);
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 88;
	}

	.nav-wrapper {
		display: flex;
		width: 100%;
		justify-content: space-between;
	}

	@media (min-width: 768px) {
		.nav-wrapper {
			align-items: center;
		}
	}

	@media (max-width: 767px) {
		.nav-wrapper {
			flex-direction: column;
			gap: 0.5rem;
			height: 100%;
			margin: 0 auto;
			position: fixed;
			width: 20rem;
			top: 0px;
			border-radius: 0px 24px 24px 0px;
			left: 0px;
			background-color: var(--surface-eight);
			padding: 1rem;
			padding-top: 6rem;
			z-index: 100;
		}

		.desktop-only {
			display: none !important;
		}

		nav {
			justify-content: normal;
		}

		.nav-buttons {
			flex-direction: column;
			gap: 0.5rem;
			width: 100%;
		}

		#secondary-navigation {
			z-index: 100;
			padding: 16px;
		}

		.admin-modal-content > form > div:has(input) {
			width: 100%;
		}
	}

	@media screen and (min-width: 768px) {
		.mobile-only {
			display: none !important;
		}
	}

	/* Hamburger mmm yum */
	.menu-btn {
		user-select: none;
		position: relative;
		display: flex;
		height: 50px;
		z-index: 999;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
	.menu-btn__burger {
		display: flex;
		flex-wrap: wrap;
	}

	.menu-btn__burger,
	.menu-btn__burger::before,
	.menu-btn__burger::after {
		width: 24px;
		height: 2px;
		background: var(--surface-six);
		transition: all 0.3s var(--bezier-one);
	}

	.menu-btn__burger::before,
	.menu-btn__burger::after {
		content: '';
		position: absolute;
	}
	.menu-btn__burger::before {
		transform: translateY(-6.5px);
	}
	.menu-btn__burger::after {
		transform: translateY(6.5px);
	}
	/* ANIMATION */
	.menu-btn.open .menu-btn__burger {
		transform: translateX(-10px);
		background: transparent;
		box-shadow: none;
	}
	.menu-btn.open .menu-btn__burger::before {
		transform: rotate(45deg) translate(10px, -10px);
	}
	.menu-btn.open .menu-btn__burger::after {
		transform: rotate(-45deg) translate(10px, 10px);
	}

	.skiptab-btn {
		position: fixed;
		left: -300px;
		border-radius: 100px;
		text-decoration: none;
		background-color: var(--primary);
		z-index: 10;
		color: var(--text-three);
		font-weight: 600;
		font-size: 0.95rem;
		padding: 16px 24px;
	}

	.skiptab-btn:focus {
		left: 12px;
	}
</style>
