<script lang="ts">
	import { slide, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { CompatiblePackage, Patch } from 'src/data/types';

	export let patch: Patch;
	export let current: boolean;
	const hasPatchOptions = !!patch.options.length;
	let expanded: boolean = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="patch-container"
	class:expanded={hasPatchOptions}
	class:rotate={expanded}
	on:click={() => (expanded = !expanded)}
>
	<div class="things">
		<div class="title">
			<h1>
				{patch.name
					// im sorry
					.replace(/-/g, ' ')
					.replace(/(?:^|\s)\S/g, (x) => x.toUpperCase())
					.replace(/Microg/g, 'MicroG')
					.replace(/Hdr/g, 'HDR')
					.replace(/Sponsorblock/g, 'SponsorBlock')
					.replace(/Tiktok/g, 'TikTok')}
			</h1>
		</div>

		{#if hasPatchOptions}
			<img id="arrow" src="/icons/arrow.svg" alt="dropdown" />
		{/if}
	</div>

	<div class="info-container">
		{#each patch.compatiblePackages as pkg, i}
			{#if current === false}
				<h2>📦 {pkg.name}</h2>
			{/if}
			<!-- gets only the lastest supported version (cant get 'any' to work without duplicates help) -->
			{#if i < pkg.versions.length - 1}
				<h2>
					🎯 {pkg.versions.slice(-1)[0] || 'Any'}
				</h2>
			{/if}
		{/each}

		<h2>🧩 {patch.version}</h2>

		{#if hasPatchOptions}
			<h2>⚙️ Patch Options</h2>
		{/if}
	</div>
	<h4>{patch.description}</h4>

	{#if expanded && hasPatchOptions}
		<span transition:fade|local={{ easing: quintOut, duration: 1000 }}>
			<div class="options" transition:slide|local={{ easing: quintOut, duration: 500 }}>
				{#each patch.options as option}
					<div class="option">
						<h3>{option.title}</h3>
						<h4>{option.description}</h4>
					</div>
				{/each}
			</div>
		</span>
	{/if}
</div>

<style>
	h1 {
		font-weight: 600;
		margin-right: 0.5rem;
		font-size: 1.25rem;
		color: var(--accent-color-two);
	}

	h2 {
		color: var(--accent-color);
		font-size: 0.8rem;
		font-weight: 500;
		border-radius: 8px;
		background-color: var(--grey-two);
		padding: 0.2rem 0.4rem;
		display: flex;
	}

	.info-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin-bottom: 0.5rem;
		margin-left: -0.2rem;
		margin-top: 0.5rem;
		width: 100%;
	}

	h3 {
		color: var(--accent-color);
		font-size: 0.9rem;
		margin-bottom: 0.1rem;
		font-weight: 500;
	}

	h4 {
		color: var(--grey-five);
		font-size: 0.9rem;
		font-weight: 400;
	}

	.patch-container {
		transition: all 2s var(--bezier-one);
		background-color: var(--grey-six);
		padding: 1.5rem;
		border-radius: 12px;
	}

	.patch-container:active {
		background-color: var(--grey-three);
	}

	.title {
		display: flex;
		align-items: center;
	}

	.things {
		display: flex;
		justify-content: space-between;
	}

	#arrow {
		height: 1.5rem;
		transition: all 0.2s var(--bezier-one);
		user-select: none;
	}

	.rotate #arrow {
		transform: rotate(180deg);
	}

	.expanded {
		cursor: pointer;
	}

	.option {
		padding: 1rem;
	}

	.option + .option {
		border-top: 1px solid var(--grey-three);
	}

	.options {
		border: 1px solid var(--grey-three);
		overflow: hidden;
		border-radius: 8px;
		margin-top: 1rem;
		display: flex;
		flex-direction: column;
	}
</style>
