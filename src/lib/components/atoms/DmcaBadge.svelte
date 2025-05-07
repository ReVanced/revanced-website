<script lang="ts">
	import { page } from '$app/state';

	type Props = { guid: string };
	let { guid }: Props = $props();
</script>

<a
	href="//www.dmca.com/Protection/Status.aspx?ID={guid}&refurl={page.url.href}"
	title="DMCA.com Protection Status"
	class="dmca-badge"
>
	<img
		src="https://images.dmca.com/Badges/dmca-badge-w150-5x1-08.png?ID={guid}"
		alt="DMCA.com Protection Status"
	/>
</a>

<style>
	a {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
