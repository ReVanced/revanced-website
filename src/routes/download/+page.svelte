<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import Page from '$components/molecules/Page.svelte';
	import Button from '$components/atoms/Button.svelte';
	import Modal from '$components/molecules/Modal.svelte';
	import Download from 'virtual:icons/material-symbols/download';
	import { managerQuery, apiStatus } from '$stores';
	import managerImg from '$assets/icons/manager.png';

	const manager = $derived(managerQuery.data);
	const version = $derived(manager?.version ?? 'Download');
	const downloadUrl = $derived(manager?.download_url ?? '');
	
	const hasDownloadData = $derived(!!manager?.download_url);

	let isAndroid = $state(false);
	let androidVersion = $state(0);

	let warningOpen = $state(false);
	let warningType = $state<'not-android' | 'old-android' | 'api-down'>('not-android');

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

	onMount(() => {
		const userAgent = navigator.userAgent;
		const match = /Android\s([\d.]+)/i.exec(userAgent);
		androidVersion = match ? parseInt(match[1]) : 0;
		isAndroid = androidVersion > 0;
	});

	function handleDownloadClick() {
		if (!isAndroid) {
			warningType = 'not-android';
			warningOpen = true;
		} else if (androidVersion < 8) {
			warningType = 'old-android';
			warningOpen = true;
		}
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
{#if warningType === 'not-android'}
<Modal bind:open={warningOpen}>
	<div class="warning-content">
		<h3>Warning</h3>
		<p>Your device is not running Android. Do you still want to download?</p>
	</div>
	{#snippet buttons()}
		<div class="warning-buttons">
			<Button
				buttonStyle="text"
				href={downloadUrl}
				onclick={() => { warningOpen = false; }}
			>
				Okay
			</Button>
			<button type="button" class="cancel-btn" onclick={() => { warningOpen = false; }}>
				Cancel
			</button>
		</div>
	{/snippet}
</Modal>
{/if}

{#if warningType === 'old-android'}
<Modal bind:open={warningOpen}>
	<div class="warning-content">
		<h3>Warning</h3>
		<p>Your device is running Android {androidVersion}. ReVanced only supports Android versions 8 and above. Do you still want to download?</p>
	</div>
	{#snippet buttons()}
		<div class="warning-buttons">
			<Button
				buttonStyle="text"
				href={downloadUrl}
				onclick={() => { warningOpen = false; }}
			>
				Okay
			</Button>
			<button type="button" class="cancel-btn" onclick={() => { warningOpen = false; }}>
				Cancel
			</button>
		</div>
	{/snippet}
</Modal>
{/if}

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

	.warning-buttons {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
	}

	.cancel-btn {
		background: transparent;
		border: none;
		color: var(--primary);
		font-weight: 500;
		font-size: 0.95rem;
		cursor: pointer;
		font-family: inherit;
		padding: 0;
	}

	.cancel-btn:hover {
		filter: brightness(85%);
	}
</style>
