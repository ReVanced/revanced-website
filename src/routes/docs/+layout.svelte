<script lang="ts">
  import type { PageData } from './$types';

  import DocsNavTree from '$lib/components/molecules/DocsNavTree.svelte';

  import { fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  export let data: PageData;
</script>

<section id="doc-section-main" in:fly={{ y: 10, easing: quintOut, duration: 700 }}>
	<div class="menu">
    <DocsNavTree tree={data.tree} />
	</div>
  <slot></slot>
</section>

<style lang="scss">
.menu {
	padding: 90px 15px 0px 15px;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

#doc-section-main {
	display: grid;
  grid-template-columns: 300px 3fr;

	height: 100vh;
	width: 100%;
}
</style>
