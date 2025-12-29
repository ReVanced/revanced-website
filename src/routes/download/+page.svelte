<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { browser } from '$app/environment';
	import Page from '$components/templates/Page.svelte';
	import Button from '$components/atoms/Button.svelte';
	import Modal from '$components/molecules/Modal.svelte';
	import Download from 'svelte-material-icons/TrayArrowDown.svelte';
	import { useManagerQuery, apiStatus } from '$stores';
	import managerImg from '$assets/icons/manager.png';

	const managerQuery = useManagerQuery();

	const manager = $derived(managerQuery.data);
	const version = $derived(manager?.version ?? 'Download');
	const downloadUrl = $derived(manager?.download_url ?? '');
	
	const hasDownloadData = $derived(!!manager?.download_url);
	const isApiDown = $derived(apiStatus.isOffline && !hasDownloadData);

	let isAndroid = $state(false);
	let androidVersion = $state(0);

	let warningOpen = $state(false);
	let warningType = $state<'not-android' | 'old-android'>('not-android');
	let warningMessage = $derived.by(() => {
		if (warningType === 'not-android') {
			return 'Your device is not running Android. Do you still want to download?';
		} else if (warningType === 'old-android') {
			return `Your device is running Android ${androidVersion}. ReVanced only supports Android versions 8 and above. Do you still want to download?`;
		}
		return '';
	});

	let apiDownOpen = $state(false);

	const schemas = [
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://revanced.app/' },
				{ '@type': 'ListItem', position: 2, name: 'Download', item: 'https://revanced.app/download' }
			]
		}
	];

	$effect(() => {
		if (!browser) return;
		const userAgent = navigator.userAgent;
		const match = /Android\s([\d.]+)/i.exec(userAgent);
		androidVersion = match ? parseInt(match[1]) : 0;
		isAndroid = androidVersion > 0;
	});

	function handleDownloadClick() {
		if (isApiDown) {
			apiDownOpen = true;
			return;
		}
		
		if (!isAndroid) {
			warningType = 'not-android';
			warningOpen = true;
		} else if (androidVersion < 8) {
			warningType = 'old-android';
			warningOpen = true;
		}
	}

	function closeWarning() {
		warningOpen = false;
	}

	function closeApiDown() {
		apiDownOpen = false;
	}
</script>

<Page description="Download ReVanced" {schemas}>
	<main class="wrapper center" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
		<h2>ReVanced <span class="highlight">Manager</span></h2>
		<p>Patch your favourite apps, right on your device.</p>

		<div class="buttons">
		{#if hasDownloadData}
			{#if !isAndroid || androidVersion < 8}
				<Button
					buttonStyle="filled"
					icon={Download}
					onclick={handleDownloadClick}
				>
					{version}
				</Button>
			{:else}
				<Button
					buttonStyle="filled"
					icon={Download}
					href={downloadUrl}
					onclick={handleDownloadClick}
				>
					{version}
				</Button>
			{/if}
		{:else}
			<Button
				buttonStyle="filled"
				icon={Download}
				onclick={handleDownloadClick}
			>
				Download
			</Button>
		{/if}
			<Button
				buttonStyle="tonal"
				href="https://github.com/revanced/revanced-manager"
				target="_blank"
			>
				View source
			</Button>
		</div>

		<div class="screenshot">
			<img src={managerImg} alt="Screenshot of ReVanced Manager" />
		</div>
	</main>
</Page>

<Modal bind:open={warningOpen}>
	<div class="warning-content">
		<h3>Warning</h3>
		<p>{warningMessage}</p>
	</div>
	{#snippet buttons()}
		<Button buttonStyle="text" onclick={closeWarning}>
			Cancel
		</Button>
		<Button
			buttonStyle="text"
			href={downloadUrl}
			onclick={closeWarning}
		>
			Okay
		</Button>
	{/snippet}
</Modal>

<Modal bind:open={apiDownOpen}>
	<div class="api-down-content">
		<h3>Service Unavailable</h3>
		<p>The API is currently down and download functionality is not available. Please try again later.</p>
	</div>
	{#snippet buttons()}
		<Button buttonStyle="text" onclick={closeApiDown}>
			Close
		</Button>
	{/snippet}
</Modal>

<style>
	.wrapper {
		margin-inline: auto;
		width: min(90%, 80rem);
		margin-top: 2.6rem;
	}

	.center {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	h2 {
		text-align: center;
		color: var(--text-one);
	}

	.highlight {
		color: var(--primary);
	}

	p {
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.buttons {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.screenshot {
		margin-top: 2.5rem;
		margin-bottom: 2.5rem;
	}

	.screenshot img {
		height: 50rem;
		width: auto;
		max-width: 100%;
		padding: 0.5rem;
		border-radius: 2rem;
		background-color: var(--surface-seven);
		user-select: none;
		object-fit: contain;
	}

	@media (max-width: 768px) {
		.screenshot img {
			height: auto;
			max-height: 70vh;
		}
	}

	.warning-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		text-align: center;
	}

	.warning-content h3 {
		color: var(--text-one);
	}

	.warning-content p {
		margin-bottom: 0;
	}

	.api-down-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		text-align: center;
	}



	.api-down-content h3 {
		color: var(--secondary);
		margin: 0;
	}

	.api-down-content p {
		margin-bottom: 0;
		color: var(--text-four);
	}
</style>
