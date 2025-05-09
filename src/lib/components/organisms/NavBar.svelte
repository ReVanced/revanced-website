<script lang="ts">
	import Banner from '$components/organisms/Banner.svelte';
	import Button from '$components/atoms/Button.svelte';
	import api from '$api';
</script>

<!-- make the banner a snippet to remove duplicate code -->
{#snippet apiDownBanner()}
	<Banner level="caution" permanent>
		The API is currently unresponsive and some services may not work correctly.
		{#await api.general.getAbout() then data}
			Check the <Button type="text" href={data.status}>status page</Button> for updates.
		{/await}
	</Banner>
{/snippet}

<div id="nav-container">
	<!-- whether the api doesn't return 204 or the request itself fails, show banner -->
	{#await api.general.ping() then apiUp}
		{#if !apiUp}
			{@render apiDownBanner()}
		{/if}
	{:catch _}
		{@render apiDownBanner()}
	{/await}

	<div class="nav-wrapper">
		<div id="main-navigation">
			<!-- apparently range ignore doesn't work -->
			<ul class="nav-buttons">
				<!-- prettier-ignore -->
				<li><Button type="navbar" href="/" label="Home">Home</Button></li>
				<!-- prettier-ignore -->
				<li><Button type="navbar" href="/download" label="Download">Download</Button></li>
				<!-- prettier-ignore -->
				<li><Button type="navbar" href="/patches" label="Patches">Patches</Button></li>
				<!-- prettier-ignore -->
				<li><Button type="navbar" href="/announcements" label="Announcements">Announcements</Button></li>
				<!-- prettier-ignore -->
				<li><Button type="navbar" href="/contributors" label="Contributors">Contributors</Button></li>
				<!-- prettier-ignore -->
				<li><Button type="navbar" href="/donate" label="Donate">Donate</Button></li>
			</ul>
		</div>
	</div>
</div>

<style>
	/* .nav-wrapper {
		display: flex;
		width: 100%;
		justify-content: space-between;
	}

	@media (min-width: 768px) {
		.nav-wrapper {
			align-items: center;
		}
	}

	#main-navigation,
	#secondary-navigation {
		align-items: center;
		display: flex;
		gap: 2rem;
	} */

	.nav-buttons {
		list-style-type: none;
		display: flex;
		gap: 1rem;
	}
</style>
