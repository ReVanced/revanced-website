<script lang="ts">
	import { goto } from '$app/navigation';
	import { email } from '$data/api/settings';
	import Banner from '$layout/Banners/Banner.svelte';

	export let statusUrl: string | null = null;

	const handleClick = () => statusUrl && goto(statusUrl);
</script>

<Banner
	title="API service is currently down"
	description="Some features of the site might be impacted. If this issue persists, reach out to mailto:{email()}"
	buttonText={statusUrl ? 'View status' : undefined}
	buttonOnClick={statusUrl ? handleClick : undefined}
	level="caution"
	permanent
/>
