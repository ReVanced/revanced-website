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

{#if contribs}
	<div class="container">
		<a href="https://github.com/{repo}" rel="noreferrer" target="_blank">
			<h2>{repo_name}</h2>
		</a>

		<div class="contrib-host">
			{#each contribs as contrib}
				{#if !usersIwantToExplodeSoBadly.includes(contrib.login)}
					<ContributorButton name={contrib.login} pfp={contrib.avatar_url} url={contrib.html_url} />
				{/if}
			{/each}
		</div>
	</div>
{/if}

<style>
	h2 {
		margin-bottom: 1rem;
	}

	a {
		transition: all 0.3s var(--bezier-one);
		display: block;
		text-decoration: none;
		width: max-content;
		border-radius: 8px;
	}

	a > h2 {
		transition: all 0.3s var(--bezier-one);
		width: max-content;
		padding: 0rem 0.4rem;
		border-radius: 8px;
	}

	a:hover > h2 {
		width: max-content;
		background-color: var(--grey-three);
		color: var(--accent-color);
	}

	.contrib-host {
		gap: 1.5rem;
		display: grid;
		justify-items: center;
		grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
		background-color: var(--grey-six);
		padding: 1.5rem;
		border-radius: 16px;
	}
</style>
