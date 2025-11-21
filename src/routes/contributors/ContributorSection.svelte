<script lang="ts">
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { Contributor } from '$lib/types';
	import ContributorButton from './ContributorPerson.svelte';

	import ChevronUp from 'svelte-material-icons/ChevronUp.svelte';

	export let contributors: Contributor[];
	export let name: string;
	export let url: string;

	let expanded = true;

	let bots = ['semantic-release-bot', 'revanced-bot'];
</script>

<div class="container">
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="title"
		class:closed={!expanded}
		on:click={() => (expanded = !expanded)}
		on:keypress={() => (expanded = !expanded)}
	>
		<a href={url} rel="noreferrer" target="_blank" on:click|stopPropagation>
			<h4>{name}</h4>
		</a>
		<div id="arrow" style:transform={expanded ? 'rotate(0deg)' : 'rotate(180deg)'}>
			<ChevronUp size="24px" color="var(--surface-six)" />
		</div>
	</div>

	{#if expanded}
		<div class="contributors" transition:slide={{ easing: quintOut, duration: 500 }}>
			{#each contributors as { name, avatar_url, url }}
				{#if !bots.includes(name)}
					<ContributorButton {name} pfp={avatar_url} {url} />
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.container {
		border-radius: 20px;
		overflow: hidden;
		border: 1px solid var(--border);

		.title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			cursor: pointer;
			background-color: var(--surface-seven);
			padding: 0.75rem 1.25rem;
			border-bottom: 1px solid var(--border);
			transition: all 0.2s var(--bezier-one);

			&:hover {
				background-color: var(--surface-three);
			}

			&.closed {
				border-bottom: none;
			}

			a {
				display: flex;
				text-decoration: none;
				width: max-content;
				border-radius: 8px;

				&:hover {
					text-decoration: underline var(--primary);
					color: var(--text-one);
				}
			}

			#arrow {
				transition: all 0.2s var(--bezier-one);
				user-select: none;
			}
		}

		.contributors {
			margin-right: -1px;
			margin-bottom: -1px;
			display: grid;
			justify-items: center;
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));

			@media (max-width: 768px) {
				padding: 0.75rem;
				gap: 0.25rem;
				grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
			}
		}
	}
</style>
