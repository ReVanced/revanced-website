<script lang="ts">
import { repositories } from "../../../data/api";
</script>

<hr />

<footer>
	<section class="main-content">
		<img src="/logo.svg" class="logo-image" alt="ReVanced Logo" />
		<div>
			<h2>
				<span>Re</span>Vanced
			</h2>
			<h5>Copyright © 2022</h5>
		</div>
	</section>

	<section class="links-container">
		<div class="link-column">
			<h4>Pages</h4>
			<a href="/"><h5>Home</h5></a>
			<a href="/download"><h5>Download</h5></a>
			<!-- <a href="/docs"><h5>Docs</h5></a> -->
			<a href="/patches"><h5>Patches</h5></a>
			<a href="/contributors"><h5>Contributors</h5></a>
		</div>
		<div class="link-column">
			<h4>Repos</h4>
			{#each $repositories as { name }}
				<a href="https://github.com/{name}" target="_blank" rel="noreferrer">
					<div>
						<h5>
							{name
								.replace(/-/g, ' ')
								.replace(/revanced\/revanced/g, '')
								.replace(/cli/g, 'CLI')
								.replace(/api/g, 'API')
								.replace(/(?:^|\s)\S/g, (x) => x.toUpperCase())}
						</h5>
					</div>
				</a>
			{/each}
		</div>
		<div class="link-column">
			<!-- to replace -->
			<h4>Socials</h4>
			<a href="https://github.com/revanced" target="_blank" rel="noreferrer"><h5>GitHub</h5></a>
			<a href="https://revanced.app/discord" target="_blank" rel="noreferrer"><h5>Discord</h5></a>
			<a href="https://reddit.com/r/revancedapp" target="_blank" rel="noreferrer"><h5>Reddit</h5></a>
			<a href="https://t.me/app_revanced" target="_blank" rel="noreferrer"><h5>Telegram</h5></a>
			<a href="https://twitter.com/revancedapp" target="_blank" rel="noreferrer"><h5>Twitter</h5></a>
			<a href="https://www.youtube.com/c/ReVanced" target="_blank" rel="noreferrer"><h5>YouTube</h5></a>
		</div>
	</section>
</footer>

<style>
	footer {
		margin: 4rem 0 5rem 0;
		margin-inline: auto;
		display: flex;
		gap: 2rem;
		justify-content: space-between;
		width: min(85%, 90rem);
	}

	h2 {
		color: var(--white);
		font-size: 1.5rem;
		font-weight: 700;
	}

	h5 {
		font-weight: 300;
	}

	.main-content {
		display: flex;
		gap: 1rem;
	}

	.main-content span {
		color: var(--accent-color);
	}

	.main-content h2 {
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


	@media screen and (max-width: 700px) {
		footer {
			flex-direction: column;
		}

		.links-container {
			display: grid;
			gap: 3rem;
			grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));

		}

	}
</style>
