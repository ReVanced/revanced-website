<script lang="ts">
	import { RV_DMCA_GUID } from '$env/static/public';

	import DmcaBadge from '$components/atoms/DmcaBadge.svelte';
	import SquigglyDivider from '$components/atoms/SquigglyDivider.svelte';
	import FooterSection from '$components/molecules/FooterSection.svelte';
	import Button from '$components/atoms/Button.svelte';

	import api from '$api';
</script>

<SquigglyDivider />
<footer>
	<div class="footer-wrapper">
		<div class="footer-top">
			<section class="main-content">
				<img src="/logo.svg" class="logo-image" alt="ReVanced Logo" />
				{#await api.general.getAbout() then data}
					<p>{data.about}</p>
				{/await}
			</section>

			<section class="links-container">
				<FooterSection title="Pages">
					<li><Button type="text" href="/">Home</Button></li>
					<li><Button type="text" href="/download">Download</Button></li>
					<li><Button type="text" href="/patches">Patches</Button></li>
					<li><Button type="text" href="/contributors">Contributors</Button></li>
					<li><Button type="text" href="/donate">Donate</Button></li>
				</FooterSection>

				{#await api.general.getAbout() then data}
					<FooterSection title="Socials">
						{#each data.socials as { name, url }}
							<li>
								<Button type="text" href={url} target="_blank">{name}</Button>
							</li>
						{/each}
					</FooterSection>
				{/await}
			</section>
		</div>

		<div class="footer-bottom">
			<div id="logo-name"><span>Re</span>Vanced</div>

			<Button type="text" href="/donate">Donate</Button>
			{#await api.general.getAbout() then data}
				<Button type="text" href="mailto:{data.contact.email}">Email</Button>
			{/await}

			<DmcaBadge guid={RV_DMCA_GUID} />
		</div>
	</div>
</footer>

<style>
	footer {
		background-color: var(--background-one);
	}

	.footer-wrapper {
		max-width: min(87%, 100rem);
		padding: 5rem 0rem;
		margin: 0 auto;
	}

	.footer-top {
		display: flex;
		gap: 8rem;
		justify-content: space-between;
		margin-bottom: 4rem;
	}

	.footer-bottom {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	@media screen and (max-width: 768px) {
		.footer-bottom {
			flex-wrap: wrap;
			gap: 1rem;
		}
	}

	#logo-name {
		font-size: 1.4rem;
		color: var(--text-one);
		font-weight: 600;
	}

	#logo-name span {
		color: var(--primary);
	}

	li {
		list-style: none;
		color: var(--text-four);
		font-size: 0.9rem;
		font-weight: 500;
	}

	.main-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: flex-start;
	}

	.logo-image {
		height: 2.5rem;
	}

	.links-container {
		display: flex;
		gap: 10rem;
		margin-top: 1rem;
	}

	@media screen and (max-width: 1050px) {
		.footer-top {
			flex-direction: column;
			gap: 2rem;
		}

		.links-container {
			display: grid;
			gap: 2rem;
			grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
		}
	}

	@media screen and (max-width: 768px) {
		.links-container {
			display: flex;
			flex-direction: column;
			gap: initial;
		}
	}
</style>
