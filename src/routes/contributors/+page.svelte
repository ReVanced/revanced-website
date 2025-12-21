<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Page from '$components/molecules/Page.svelte';
	import ContributorSection from '$components/organisms/ContributorSection.svelte';
	import { contributorsQuery } from '$stores';

	const repositories = $derived(contributorsQuery.data ?? []);
	const isLoading = $derived(contributorsQuery.loading && repositories.length === 0);
	const isError = $derived(contributorsQuery.error && repositories.length === 0);

	const schemas = [
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://revanced.app/' },
				{ '@type': 'ListItem', position: 2, name: 'Contributors', item: 'https://revanced.app/contributors' }
			]
		}
	];
</script>

<Page title="Contributors of ReVanced" description="ReVanced is made possible by the community" {schemas}>
	<div class="wrapper">
		<div class="text-container" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
			<h2>Made possible by the community.</h2>
			<p>
				Want to show up here?
				<a href="https://github.com/revanced" target="_blank" rel="noreferrer">
					Become a contributor
				</a>
			</p>
		</div>

		<div class="repos">
			{#if isLoading}
				<div class="loading-state">
					<div class="skeleton-repos">
						{#each Array(3) as _}
							<div class="skeleton-repo"></div>
						{/each}
					</div>
				</div>
			{:else if isError}
				<p class="error-state">Failed to load contributors. Please try again later.</p>
			{:else}
				{#each repositories as repo}
					<div in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
						<ContributorSection
							name={repo.name}
							url={repo.url}
							contributors={repo.contributors}
						/>
					</div>
				{/each}
			{/if}
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

	.loading-state {
		display: flex;
		justify-content: center;
	}

	.skeleton-repos {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		width: 100%;
	}

	.skeleton-repo {
		height: 200px;
		background: linear-gradient(
			90deg,
			var(--surface-three) 25%,
			var(--surface-five) 50%,
			var(--surface-three) 75%
		);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
		border-radius: 16px;
	}

	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	.error-state {
		text-align: center;
		color: var(--text-four);
		padding: 2rem;
	}

	@media (max-width: 768px) {
		.text-container {
			padding: 2rem 1.75rem;
		}
	}
</style>
