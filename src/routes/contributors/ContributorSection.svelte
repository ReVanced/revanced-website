<script lang="ts">
	import { friendlyName } from '$util/friendlyName';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { Contributor } from '$lib/types';
	import ContributorButton from './ContributorPerson.svelte';

	export let contributors: Contributor[];
	export let repo: string;
	let expanded = true;

	let bots = ['semantic-release-bot', 'revanced-bot'];
	let repo_name = friendlyName(repo);
</script>

<div class="section-container">
	<div
		class="title"
		class:closed={!expanded}
		on:click={() => (expanded = !expanded)}
		on:keypress={() => (expanded = !expanded)}
	>
		<a href="https://github.com/ReVanced/{repo}" rel="noreferrer" target="_blank" on:click|stopPropagation>
			<h4>{repo_name}</h4>
		</a>
		<img
			id="arrow"
			style:transform={expanded ? 'rotate(0deg)' : 'rotate(-180deg)'}
			src="/icons/expand_less.svg"
			alt="dropdown"
		/>
	</div>

	{#if expanded}
		<div class="contrib-host" transition:slide={{ easing: quintOut, duration: 500 }}>
			{#each contributors as { name, avatar_url, url }}
				{#if !bots.includes(name)}
					<ContributorButton {name} pfp={avatar_url} {url} />
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
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
	}

	.closed {
		border-bottom: none;
	}

	#arrow {
		height: 1.5rem;
		transition: all 0.2s var(--bezier-one);
		user-select: none;
	}

	.section-container {
		border-radius: 20px;
		overflow: hidden;
		border: 1px solid var(--border);
	}

	a {
		display: flex;
		text-decoration: none;
		width: max-content;
		border-radius: 8px;
	}

	a:hover {
		text-decoration: underline var(--primary);
		color: var(--text-one);
	}

	.contrib-host {
		margin-right: -1px;
		margin-bottom: -1px;
		display: grid;
		justify-items: center;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	}

	@media (max-width: 767px) {
		.contrib-host {
			padding: 0.75rem;
			gap: 0.25rem;
			grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
		}
	}
</style>
