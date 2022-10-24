<script lang="ts">
	import type { Contributor } from 'src/data/types';
	import ContributorButton from '../atoms/ContributorPerson.svelte';

	export let contribs: Contributor[];
	export let repo: string;

	let repo_name = repo
		.replace(/-/g, ' ')
		.replace(/revanced\/revanced/g, 'ReVanced')
		.replace(/cli/g, 'CLI')
		.replace(/api/g, 'API')
		.replace(/(?:^|\s)\S/g, (x) => x.toUpperCase());

	let usersIwantToExplodeSoBadly = ['semantic-release-bot'];
</script>

<div class="title">
	<a href="https://github.com/{repo}" rel="noreferrer" target="_blank">
		<h2>{repo_name}</h2>
	</a>
</div>

<hr/>

<div class="contrib-host">
	{#each contribs as contrib}
		{#if !usersIwantToExplodeSoBadly.includes(contrib.login)}
			<ContributorButton name={contrib.login} pfp={contrib.avatar_url} url={contrib.html_url} />
		{/if}
	{/each}
</div>

<style>
	.title {
		display: flex;
		align-items: center;
		border-radius: 4px;
		transform: translateX(-6px);
	}
	h2 {
		text-align: center;
		font-size: 1.25rem;
	}

	hr {
		margin-top: 0.5rem;
		margin-bottom: 1rem;
		border-top: 1px solid var(--grey-two);
	}
	a {
		transition: all 0.3s var(--bezier-one);
		display: flex;
		text-decoration: none;
		width: max-content;
		border-radius: 8px;
	}

	a > h2 {
		transition: all 0.3s var(--bezier-one);
		width: max-content;
		padding: 0rem 0.4rem;
		border-radius: 4px;
	}

	a:hover > h2 {
		width: max-content;
		background-color: var(--grey-three);
		color: var(--accent-color);
	}

	.contrib-host {
		gap: 0.5rem;
		display: grid;
		justify-items: center;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	}
</style>
