<script lang="ts">
	import { slide, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { Patch } from '$lib/types';
	import { compare, coerce } from 'semver';
	import Button from '$lib/components/Button.svelte';

	export let patch: Patch;
	export let showAllVersions: boolean;
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
			<h3>{patch.name}</h3>
		</div>
		{#if hasPatchOptions}
			<img class="expand-arrow" id="expand-card" src="/icons/arrow.svg" alt="dropdown" />
		{/if}
	</div>
	<h5>{patch.description}</h5>
	<ul class="info-container">
		{#each patch.compatiblePackages as pkg}
			<a
				href="https://play.google.com/store/apps/details?id={pkg.name}"
				target="_blank"
				rel="noreferrer"
			>
				<li class="patch-info">📦 {pkg.name}</li>
			</a>
		{/each}

		{#if !patch.compatiblePackages.length}
			<li class="patch-info">🌎 Universal patch</li>
		{/if}

		{#if hasPatchOptions}
			<li class="patch-info">⚙️ Patch options</li>
		{/if}

		<!-- should i hardcode this to get the version of the first package? idk you cant stop me -->
		{#if patch.compatiblePackages.length && patch.compatiblePackages[0].versions.length}
			{#if showAllVersions}
				{#each patch.compatiblePackages[0].versions
					.slice()
					.sort((a, b) => {
						const coercedA = coerce(a);
						const coercedB = coerce(b);
						if (coercedA && coercedB) return compare(coercedA, coercedB);
						else if (!coercedA && !coercedB) return 0;
						else return !coercedA ? 1 : -1;
					})
					.reverse() as version}
					<li class="patch-info">
						🎯 {version}
					</li>
				{/each}
			{:else}
				<li class="patch-info">
					🎯 {patch.compatiblePackages[0].versions.slice(-1)}
				</li>
			{/if}
			{#if patch.compatiblePackages[0].versions.length > 1}
				<Button type="text" on:click={() => (showAllVersions = !showAllVersions)}>
					<img
						class="expand-arrow"
						id="expand-versions"
						style:transform={showAllVersions ? 'rotate(90deg)' : 'rotate(-90deg)'}
						src="/icons/expand_more.svg"
						alt="dropdown"
					/>
				</Button>
			{/if}
		{/if}
	</ul>

	{#if expanded && hasPatchOptions}
		<span transition:fade|local={{ easing: quintOut, duration: 1000 }}>
			<div class="options" transition:slide|local={{ easing: quintOut, duration: 500 }}>
				{#each patch.options as option}
					<div class="option">
						<h5 id="option-title">{option.title}</h5>
						<h5>{option.description}</h5>
					</div>
				{/each}
			</div>
		</span>
	{/if}
</div>

<style lang="scss">
	h3 {
		margin-right: 0.5rem;
		margin-bottom: 0.2rem;
		color: var(--accent-color);
	}

	#option-title {
		color: var(--accent-color-two);
	}

	.patch-info {
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--grey-five);
		padding: 0.25rem 0.5rem;
		border: 1px solid var(--grey-three);
		border-radius: 8px;

		&:hover {
			background-color: var(--grey-two);
		}
	}

	a {
		text-decoration: none;
	}

	a .patch-info:hover {
		text-decoration: underline var(--accent-color-two);
		color: var(--accent-color-two);
	}

	.info-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin: 0.3rem 0rem;
		width: 100%;
		margin-top: 0.5rem;
	}

	.patch-container {
		transition: all 0.1s var(--bezier-one);
		background-color: var(--grey-six);
		padding: 1.25rem;
		border-radius: 12px;

		&:active {
			filter: brightness(1.15);
		}

		&:hover {
			background-color: var(--grey-one);
		}
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
		transition: all 0.2s var(--bezier-one);
		user-select: none;
		&#expand-versions {
			height: 1.125rem;
		}
		&#expand-card {
			height: 1.5rem;
		}
	}

	.rotate .expand-arrow {
		transform: rotate(180deg);
	}

	.expanded {
		cursor: pointer;
	}

	.option {
		padding: 1rem;

		&:hover {
			background-color: var(--grey-two);
		}
	}

	/* thanks piknik */
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
