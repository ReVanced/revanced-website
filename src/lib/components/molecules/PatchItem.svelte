<script lang="ts">
	import type { Patch } from '$api';
	import Button from '$components/atoms/Button.svelte';
	import IconChevronDown from 'virtual:icons/material-symbols/keyboard-arrow-down';

	type Props = {
		patch: Patch;
		showAllVersions?: boolean;
		onToggleVersions?: () => void;
	};

	let { patch, showAllVersions = false, onToggleVersions }: Props = $props();

	let expanded = $state(false);

	let hasPatchOptions = $derived(patch.options.length > 0);

	let compatiblePackagesArray = $derived(
		patch.compatiblePackages
			? Object.entries(patch.compatiblePackages).map(([name, versions]) => ({ name, versions }))
			: null
	);

	function toggleExpand() {
		if (hasPatchOptions) {
			expanded = !expanded;
		}
	}

	function handleVersionToggle(e: MouseEvent) {
		e.stopPropagation();
		onToggleVersions?.();
	}
</script>

<div
	class="patch-container"
	class:expanded={hasPatchOptions}
	class:rotate={expanded}
	role="button"
	tabindex="0"
	onclick={toggleExpand}
	onkeydown={(e) => e.key === 'Enter' && toggleExpand()}
>
	<div class="things">
		<div class="title">
			<h3>{patch.name}</h3>
		</div>
		{#if hasPatchOptions}
			<div class="expand-arrow">
				<IconChevronDown />
			</div>
		{/if}
	</div>

	{#if patch.description}
		<h5>{patch.description}</h5>
	{/if}

	<ul class="info-container">
		{#if !compatiblePackagesArray}
			<li class="patch-info">🌎 Universal patch</li>
		{:else}
			{#each compatiblePackagesArray as pkg}
				<li class="patch-info">
					<a
						href="https://play.google.com/store/apps/details?id={pkg.name}"
						target="_blank"
						rel="noreferrer"
						onclick={(e) => e.stopPropagation()}
					>
						📦 {pkg.name}
					</a>
				</li>
			{/each}
		{/if}

		{#if hasPatchOptions}
			<li class="patch-info">⚙️ Patch options</li>
		{/if}

		{#if compatiblePackagesArray?.length && compatiblePackagesArray[0].versions?.length}
			{@const versions = compatiblePackagesArray[0].versions}
			{#if showAllVersions}
				{#each [...versions].reverse() as version}
					<li class="patch-info">🎯 {version}</li>
				{/each}
			{:else}
				<li class="patch-info">🎯 {versions[versions.length - 1]}</li>
			{/if}
			{#if versions.length > 1}
				<li class="button-item">
					<Button buttonStyle="text" onclick={handleVersionToggle}>
						<span
							class="version-toggle-icon"
							class:expanded={showAllVersions}
						>
							<IconChevronDown />
						</span>
					</Button>
				</li>
			{/if}
		{:else}
			<li class="patch-info">🎯 Any version</li>
		{/if}
	</ul>

	{#if expanded && hasPatchOptions}
		<div class="options">
			{#each patch.options as option}
				<div
					class="option"
					role="presentation"
					onclick={(e) => e.stopPropagation()}
				>
					<h5 class="option-title">{option.title}</h5>
					<h5>
						<pre class="option-description">{option.description}</pre>
					</h5>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.patch-container {
		transition: all 0.1s var(--bezier-one);
		background-color: var(--surface-seven);
		padding: 1.25rem;
		border-radius: 12px;
	}

	h3 {
		margin-right: 0.5rem;
		margin-bottom: 0.2rem;
		color: var(--primary);
	}

	.title {
		display: flex;
		align-items: center;
	}

	.things {
		display: flex;
		justify-content: space-between;
	}

	.expand-arrow {
		transition: transform 0.2s var(--bezier-one);
		user-select: none;
		height: 1.5rem;
		color: var(--surface-six);
	}

	.expand-arrow :global(svg) {
		width: 24px;
		height: 24px;
	}

	.rotate .expand-arrow {
		transform: rotate(180deg);
	}

	.expanded {
		cursor: pointer;
	}

	.expanded:hover {
		background-color: var(--surface-three);
	}

	.expanded:active {
		filter: brightness(1.15);
	}

	.info-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin: 0.3rem 0;
		margin-top: 0.5rem;
		padding: 0;
		width: 100%;
		list-style: none;
	}

	.patch-info {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--text-four);
		padding: 0.25rem 0.5rem;
		border: 1px solid var(--border);
		border-radius: 8px;
		transition: background-color 0.2s var(--bezier-one);
	}

	.patch-info:hover {
		background-color: var(--surface-four);
	}

	.patch-info a {
		text-decoration: none;
		color: var(--text-four);
		transition: color 0.2s var(--bezier-one);
	}

	.patch-info a:hover {
		text-decoration: underline var(--secondary);
		color: var(--secondary);
	}

	.button-item {
		display: flex;
		align-items: center;
		list-style: none;
	}

	.version-toggle-icon {
		display: inline-flex;
		transition: transform 0.2s var(--bezier-one);
		transform: rotate(-90deg);
		color: var(--surface-six);
	}

	.version-toggle-icon.expanded {
		transform: rotate(90deg);
	}

	.version-toggle-icon :global(svg) {
		width: 24px;
		height: 24px;
	}

	.options {
		border: 1px solid var(--border);
		overflow: hidden;
		border-radius: 8px;
		margin-top: 1rem;
		display: flex;
		flex-direction: column;
	}

	.option {
		padding: 1rem;
	}

	.option + .option {
		border-top: 1px solid var(--border);
	}

	.option-title {
		color: var(--secondary);
	}

	.option-description {
		white-space: pre-wrap;
		word-break: break-word;
		font-family: inherit;
		margin: 0;
	}
</style>
