<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import ContributorHost from './ContributorSection.svelte';
	import Head from '$lib/components/Head.svelte';
	import Query from '$lib/components/Query.svelte';

	import { queries } from '$data/api';
	import { createQuery } from '@tanstack/svelte-query';

	const query = createQuery(queries.contributors());
</script>

<Head
	title="Contributors of ReVanced"
	description="ReVanced is made possible by the community. Check out the people who have contributed to the project and how you can contribute too."
	schemas={[
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Home',
					item: 'https://revanced.app/'
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Contributors',
					item: 'https://revanced.app/contributors'
				}
			]
		}
	]}
/>

<div class="wrapper">
	<div class="text-container" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
		<h2>Made possible by the community.</h2>
		<p>
			Want to show up here? <span>
				<a href="https://github.com/revanced" target="_blank" rel="noreferrer"
					>Become a contributor
				</a>
			</span>
		</p>
	</div>

	<div class="repos">
		<Query {query} let:data>
			{#each data.contributables as { name, url, contributors }}
				<div in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
					<ContributorHost {name} {url} {contributors} />
				</div>
			{/each}
		</Query>
	</div>
</div>

<style>
	.wrapper {
		margin-bottom: 5rem;
	}

	.repos {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	h2 {
		text-align: center;
		color: var(--text-three);
		margin-bottom: 0.3rem;
	}

	p {
		text-align: center;
		color: var(--text-three);
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

	a {
		text-decoration: none;
		color: var(--text-three);
	}

	a::after {
		padding-left: 5px;
		content: '→';
		position: absolute;
		transition: all 0.3s var(--bezier-one);
	}

	a:hover {
		text-decoration: underline var(--text-three);
	}

	a:hover::after {
		transform: translateX(5px);
	}
	@media (max-width: 768px) {
		.text-container {
			padding: 2rem 1.75rem;
		}
	}
</style>
