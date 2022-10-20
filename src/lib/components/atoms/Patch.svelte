<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let name: string;
	export let desc: string;
	export let ver: string;
	// export let pkgName: string;
	export let hasPatchOptions: boolean;

	function handleClick() {
		const el = document.getElementById('arrow');
		if (!el) return;
		el!.style.transform = 'rotate(180deg)';
	}
</script>

<div
	class="patch-container {hasPatchOptions ? 'expanded' : ''}"
	on:click={hasPatchOptions ? handleClick : null}
>
	<div class="things">
		<div class="title">
			<h1>{name}</h1>
			<h3>{ver}</h3>
		</div>

		{#if hasPatchOptions}
			<img id="arrow" src="/icons/arrow.svg" alt="dropdown" />
		{/if}
	</div>
	<!-- <h3>{pkgName}</h3> -->
	<h4>{desc}</h4>
</div>

<style>
	h1 {
		font-weight: 600;
		margin-bottom: 0.5rem;
		margin-right: 0.5rem;
		font-size: 1.25rem;
	}

	h3 {
		color: var(--grey-five);
		font-size: 0.8rem;
		margin-bottom: 0.1rem;
	}

	h4 {
		color: var(--grey-five);
		font-size: 0.8rem;
		font-weight: 400;
	}

	.patch-container {
		background-color: var(--grey-six);
		padding: 1.5rem;
		border-radius: 8px;
	}

	.title {
		display: flex;
		align-items: center;
	}

	.things {
		display: flex;
		justify-content: space-between;
	}

	img {
		height: 1.5rem;
	}

	.expanded {
	}
</style>
