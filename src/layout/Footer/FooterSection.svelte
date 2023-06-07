<script lang="ts">
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let title: string;
	let expanded: boolean = false;
</script>

<div class="desktop-only">
	<span>{title}</span>
	<ul>
		<slot />
	</ul>
</div>

<div class="mobile-only">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<button class="title" on:click={() => (expanded = !expanded)}>
		<span>
			{title}
		</span>
		<span>{expanded ? '-' : '+'}</span>
	</button>
	{#if expanded}
		<ul transition:slide|local={{ easing: quintOut, duration: 500 }}>
			<slot />
		</ul>
	{/if}
</div>

<style lang="scss">
	span {
		list-style: none;
		color: var(--grey-five);
		font-size: 0.9rem;
		font-weight: 500;
	}

	ul {
		margin: 1.25rem 0rem;
		display: flex;
		flex-direction: column;
		width: max-content;
	}

	.title {
		display: flex;
		justify-content: space-between;
		background-color: transparent;
		border: none;
		width: 100%;
		margin: 1.5rem 0;
		cursor: pointer;
	}

	.mobile-only:not(:last-child) {
		border-bottom: 1px solid var(--grey-three);
	}

	.mobile-only {
		display: none;
	}

	@media screen and (max-width: 768px) {
		.mobile-only {
			display: block;
		}
		.desktop-only {
			display: none;
		}
	}
</style>
