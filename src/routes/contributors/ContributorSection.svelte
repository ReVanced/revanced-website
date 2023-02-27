<script lang="ts">
	import { friendlyName } from '$util/friendlyName';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { Contributor } from '$lib/types';
	import ContributorButton from './ContributorPerson.svelte';

	export let contributors: Contributor[];
	export let repo: string;
	let expanded = true;

	// Yes
	let usersIwantToExplodeSoBadly = ['semantic-release-bot'];
	let repo_name = friendlyName(repo);
</script>

<div class="section-container">
	<div
		class="title"
		class:closed={!expanded}
		on:click={() => (expanded = !expanded)}
		on:keypress={() => (expanded = !expanded)}
	>
		<a href="https://github.com/{repo}" rel="noreferrer" target="_blank">
			<h4>{repo_name}</h4>
		</a>
		<img
			id="arrow"
			style:transform={expanded ? 'rotate(0deg)' : 'rotate(-180deg)'}
			src="/icons/arrow.svg"
			alt="dropdown"
		/>
	</div>

	{#if expanded}
		<div class="contrib-host" transition:slide|local={{ easing: quintOut, duration: 500 }}>
			{#each contributors as { login, avatar_url, html_url }}
				{#if !usersIwantToExplodeSoBadly.includes(login)}
					<ContributorButton name={login} pfp={avatar_url} url={html_url} />
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style>
	.title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		cursor: pointer;
		background-color: var(--grey-six);
		padding: 0.75rem 1.25rem;
		border-bottom: 1px solid var(--grey-three);
		transition: all 0.2s var(--bezier-one);
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
		border: 1px solid var(--grey-three);
	}

	a {
		transition: all 0.3s var(--bezier-one);
		display: flex;
		text-decoration: none;
		width: max-content;
		border-radius: 8px;
	}

	a:hover {
		text-decoration: underline;
		text-decoration-style: wavy;
		text-decoration-color: var(--accent-color);
		color: var(--white);
	}

	.contrib-host {
		margin-right: -1px;
		margin-bottom: -1px;
		display: grid;
		justify-items: center;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	}

	@media (max-width: 768px) {
		.contrib-host {
			padding: 0.75rem;
			gap: 0.25rem;
			grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
		}
	}
</style>
