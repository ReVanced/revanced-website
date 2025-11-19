<script lang="ts">
	import '../app.css';
	import favicon from '$assets/favicon.ico';
	import NavBar from '$components/organisms/NavBar.svelte';
	import ModalBackdrop from '$components/atoms/ModalBackground.svelte';
	import Modal from '$components/organisms/Modal.svelte';
	import SettingsPanel from '$components/molecules/SettingsPanel.svelte';
	import { ui } from '$stores/ui.svelte';
	import type { WithChildren } from '$types';

	let { children }: WithChildren = $props();

	// Provide settings & login modals at layout level
	let settingsOpen = $derived(ui.isSettingsOpen());
	let loginOpen = $derived(ui.isLoginOpen());
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<NavBar />
<ModalBackdrop />
<Modal id="settings" bind:open={settingsOpen} label="Settings dialog">
	<h2>Settings</h2>
	<SettingsPanel />
</Modal>
<Modal id="login" bind:open={loginOpen} label="Login dialog">
	<h2>Login</h2>
</Modal>
{@render children()}
