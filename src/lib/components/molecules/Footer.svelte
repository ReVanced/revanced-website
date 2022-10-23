<script lang="ts">
	import { onMount } from 'svelte';

	import type { ContribData } from '../../../data/ContributorsStore';
	import { ContributorsStore } from '../../../data/ContributorsStore';
	
	let data: ContribData;

	onMount(() => {
		ContributorsStore.subscribe(async (e: Promise<ContribData>) => {
			data = await e;
		});
	});
</script>

<hr />

<footer>
	<section class="main-content">
		<img src="/logo.svg" class="logo-image" alt="ReVanced Logo" />
		<div>
			<h1>
                <span>Re</span>Vanced
            </h1>
			<h6>Copyright © 2022, we are very legal</h6>
		</div>
	</section>

	<section class="links-container">
		<div class="link-column">
			<h5>Pages</h5>
			<a href="/"><h6>Home</h6></a>
			<a href="/download"><h6>Download</h6></a>
			<a href="/docs"><h6>Docs</h6></a>
			<a href="/patches"><h6>Patches</h6></a>
			<a href="/credits"><h6>Credits</h6></a>
		</div>
		<div class="link-column">
			<h5>Repos</h5>
			{#if data}
				{#each data.repositories as { name }}
				<a href="https://github.com/{name}" target="_blank" rel="noreferrer">
					<div>
						<h6>{name
							.replace(/-/g, ' ')
							.replace(/revanced\/revanced/g, '')
							.replace(/cli/g, 'CLI')
							.replace(/api/g, 'API')
							.replace(/(?:^|\s)\S/g, (x) => x.toUpperCase())}
						</h6>
					</div>
				</a>
				{/each}
			{/if}
		</div>
		<div class="link-column">
			<!-- to replace -->
			<h5>Socials</h5>
			<a href="/"><h6>Github</h6></a>
			<a href="/"><h6>Discord</h6></a>
			<a href="/"><h6>Reddit</h6></a>
			<a href="/"><h6>Twitter</h6></a>
			<a href="/"><h6>Telegram</h6></a>
			<a href="/"><h6>Video Site</h6></a>
		</div>
	</section>
</footer>

<style>

	footer {
		margin: 4rem 0 5rem 0;
		margin-inline: auto;
		display: flex;
		justify-content: space-between;
		width: min(85%, 90rem);
	}

	.main-content {
		display: flex;
		gap: 1rem;
	}

    .main-content span {
        color: var(--accent-color);
    }

    .main-content h1 {
        letter-spacing: -0.04rem;
        margin-bottom: 0.5rem;
    }

	img {
		height: 3rem;
	}

	a {
		text-decoration: none;
	}

	.links-container {
		display: flex;
		gap: 5rem;
	}

	.link-column {
		display: flex;
		gap: 0.5rem;
		flex-direction: column;
	}

	hr {
		display: block;
		height: 1px;
		border: 0;
		border-top: 1px solid var(--grey-three);
		margin-top: 1rem;
	}
</style>
