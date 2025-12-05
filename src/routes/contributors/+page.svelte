<script lang="ts">
	import Page from '$components/molecules/Page.svelte';
	import ContributorSection from '$components/organisms/ContributorSection.svelte';
	import { contributorsQuery } from '$stores';
	const repositories = $derived(contributorsQuery.data ?? []);
</script>

<Page title="Contributors of ReVanced" description="ReVanced is made possible by the community">
	<div class="wrapper">
		<div class="text-container">
			<h2>Made possible by the community.</h2>
			<p>
				Want to show up here?
				<a href="https://github.com/revanced" target="_blank" rel="noreferrer">
					Become a contributor
				</a>
			</p>
		</div>

		<div class="repos">
			{#each repositories as repo}
				<ContributorSection
					name={repo.name}
					url={repo.url}
					contributors={repo.contributors}
				/>
			{/each}
		</div>
	</div>
</Page>

<style>
	.wrapper {
		width: min(90%, 80rem);
		margin-inline: auto;
		margin-bottom: 5rem;
		padding-top: 2rem;
	}

	.text-container {
		display: flex;
		align-items: center;
		flex-direction: column;
		margin-bottom: 2rem;
		background-color: var(--primary);
		padding: 2.5rem 1.75rem;
		border-radius: 20px;
	}

	.text-container h2 {
		text-align: center;
		color: var(--text-three);
		margin-bottom: 0.3rem;
	}

	.text-container p {
		text-align: center;
		color: var(--text-three);
		margin: 0;
	}

	.text-container a {
		text-decoration: none;
		color: var(--text-three);
		position: relative;
	}

	.text-container a::after {
		content: '→';
		padding-left: 5px;
		position: absolute;
		transition: transform 0.3s var(--bezier-one);
	}

	.text-container a:hover {
		text-decoration: underline var(--text-three);
	}

	.text-container a:hover::after {
		transform: translateX(5px);
	}

	.repos {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	@media (max-width: 768px) {
		.text-container {
			padding: 2rem 1.75rem;
		}
	}
</style>
