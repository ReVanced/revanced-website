<script lang="ts">
	import type { Contributor } from '$api';
	import ContributorCard from '$components/molecules/ContributorCard.svelte';
	import IconChevronUp from 'svelte-material-icons/ChevronUp.svelte';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	type Props = {
		name: string;
		url: string;
		contributors: Contributor[];
	};

	let { name, url, contributors }: Props = $props();

	let expanded = $state(true);

	const botNames = ['semantic-release-bot', 'revanced-bot'];
	let filteredContributors = $derived(
		contributors.filter((c) => !botNames.includes(c.name))
	);

	function toggleExpand() {
		expanded = !expanded;
	}
</script>

<div class="container">
	<button
		type="button"
		class="title"
		class:closed={!expanded}
		onclick={toggleExpand}
	>
		<a
			href={url}
			rel="noreferrer"
			target="_blank"
			onclick={(e) => e.stopPropagation()}
		>
			<h4>{name}</h4>
		</a>
		<div class="arrow" class:rotated={!expanded}>
			<IconChevronUp size={24} />
		</div>
	</button>

	{#if expanded}
		<div class="contributors" transition:slide={{ easing: quintOut, duration: 500 }}>
			{#key filteredContributors.length}
				{#each filteredContributors as contributor}
					<ContributorCard
						name={contributor.name}
						avatarUrl={contributor.avatar_url}
						url={contributor.url}
					/>
				{/each}
			{/key}
		</div>
	{/if}
</div>

<style>
	.container {
		border-radius: 20px;
		overflow: hidden;
		border: 1px solid var(--border);
	}

	.title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		cursor: pointer;
		background-color: var(--surface-seven);
		padding: 0.75rem 1.25rem;
		border: none;
		border-bottom: 1px solid var(--border);
		transition: background-color 0.2s var(--bezier-one);
		font-family: inherit;
	}

	.title:hover {
		background-color: var(--surface-three);
	}

	.title.closed {
		border-bottom: none;
	}

	.title a {
		display: flex;
		text-decoration: none;
		width: max-content;
		border-radius: 8px;
		color: var(--text-one);
	}

	.title a:hover {
		text-decoration: underline var(--primary);
	}

	.title a h4 {
		margin: 0;
	}

	.arrow {
		transition: transform 0.2s var(--bezier-one);
		user-select: none;
		color: var(--surface-six);
		display: flex;
		align-items: center;
	}

	.arrow :global(svg) {
		width: 24px;
		height: 24px;
	}

	.arrow.rotated {
		transform: rotate(180deg);
	}

	.contributors {
		margin-right: -1px;
		margin-bottom: -1px;
		display: grid;
		justify-items: center;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	}

	@media (max-width: 768px) {
		.contributors {
			padding: 0.75rem;
			gap: 0.25rem;
			grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
		}
	}
</style>
