<script lang="ts">
	import Banner from '$components/organisms/Banner.svelte';
	import Button from '$components/atoms/Button.svelte';
	import api from '$api';

	const statusUrl = 'https://status.revanced.app/'; // TODO: replace with env variable
</script>

{#await api.general.ping() then apiUp}
	{#if !apiUp}
		<Banner level="caution" permanent>
			The API is currently unresponsive and some services may not work correctly.
			{#if statusUrl}
				Check the <Button type="text" href={statusUrl}>status page</Button> for updates.
			{/if}
		</Banner>
	{/if}
{/await}
