<script lang="ts">
	import type { LayoutData } from './$types';

	import DocsNavTree from './DocsNavTree.svelte';
	import Footer from '$layout/Footer/FooterHost.svelte';

	export let data: LayoutData;
</script>

<section id="doc-section-main">
	<div class="menu">
		<DocsNavTree tree={data.tree} />
	</div>
	<slot />
</section>
<Footer />

<style lang="scss">
	#doc-section-main {
		margin-inline: auto;
		width: min(90%, 90rem);
		margin-top: 8rem;
		margin-bottom: 5rem;
	}

	.menu {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	#doc-section-main {
		display: grid;
		grid-template-columns: 320px 3fr;
		gap: 3rem;
	}
</style>
