<script lang="ts">
	import { RV_DMCA_GUID } from '$env/static/public';

	let refurl: string = $state('');
	$effect(() => {
		refurl = window.location.href;
	});
</script>

<a
	href="//www.dmca.com/Protection/Status.aspx?ID={RV_DMCA_GUID}&refurl={refurl}"
	title="DMCA.com Protection Status"
	class="dmca-badge"
>
	<img
		src="https://images.dmca.com/Badges/dmca-badge-w150-5x1-08.png?ID={RV_DMCA_GUID}"
		alt="DMCA.com Protection Status"
	/>
</a>
