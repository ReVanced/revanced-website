<script lang="ts">
	import { goto } from '$app/navigation';
	import Banner from '$lib/components/Banner.svelte';

	export let statusUrl: string | null = null;

	const handleClick = () => statusUrl && goto(statusUrl);
</script>

<Banner
	title="API service is currently down"
	description="We're actively investigating and will update you shortly. We appreciate your patience."
	buttonText={statusUrl ? 'View status' : undefined}
	buttonOnClick={statusUrl ? handleClick : undefined}
	level="caution"
	permanent
/>
