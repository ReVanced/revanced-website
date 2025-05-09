<script lang="ts">
	import Banner from '$components/organisms/Banner.svelte';
	import Button from '$components/atoms/Button.svelte';
	import api from '$api';
</script>

{#await api.general.ping() then apiUp}
	{#if !apiUp}
		<Banner level="caution" permanent>
			The API is currently unresponsive and some services may not work correctly.
			{#await api.general.getAbout() then data}
				Check the <Button type="text" href={data.status}>status page</Button> for updates.
			{/await}
		</Banner>
	{/if}
{/await}
