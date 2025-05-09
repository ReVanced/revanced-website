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

<div class="nav-container">
	<!-- whether the api doesn't return 204 or the request itself fails, show banner -->
	{#await api.general.ping() then apiUp}
		{#if !apiUp}
			{@render apiDownBanner()}
		{/if}
	{:catch _}
		{@render apiDownBanner()}
	{/await}
</div>
