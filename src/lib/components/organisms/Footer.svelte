<script lang="ts">
	import { RV_DMCA_GUID } from '$env/static/public';

	import DmcaBadge from '$components/atoms/DmcaBadge.svelte';
	import SquigglyDivider from '$components/atoms/SquigglyDivider.svelte';
</script>

<footer>
	<SquigglyDivider />

	<div class="footer-top">
		<section class="main-content"></section>
		<section class="links-container"></section>
	</div>

	<div class="footer-bottom"></div>

	<DmcaBadge guid={RV_DMCA_GUID} />
</footer>
