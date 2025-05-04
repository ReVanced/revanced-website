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
	<div class="footer-top">
		<section class="main-content">
			<img src="/logo.svg" class="logo-image" alt="ReVanced Logo" />
			{#await api.general.getAbout() then data}
				<div>
					<p>{data.about}</p>
				</div>
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
		<a href="/donate"><div>Donate</div></a>

		{#await api.general.getAbout() then data}
			<Button type="text" href="mailto:{data.contact.email}">Email</Button>
		{/await}

		<DmcaBadge guid={RV_DMCA_GUID} />
	</div>
</footer>
