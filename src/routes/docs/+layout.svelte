<script lang="ts">
	import type { PageData } from './$types';

	import DocsNavTree from '$lib/components/molecules/DocsNavTree.svelte';

	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Footer from '$lib/components/molecules/Footer.svelte';

	export let data: PageData;
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
