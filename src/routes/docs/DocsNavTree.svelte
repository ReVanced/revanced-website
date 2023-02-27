<script lang="ts">
	import { is_tree, assert_is_info_node } from './documentation.shared';
	import type { DocsTree } from './documentation.shared';

	import DocsNavNode from './DocsNavNode.svelte';

	export let tree: DocsTree;
	// How deeply nested this is.
	export let nested = 0;
</script>

{#if nested}
	<!-- The index should be part of the `ul` above us. -->
	<DocsNavNode info={tree.index} />
{/if}

<ul>
	{#if !nested}
		<!-- There is no `ul` above us, so index should go here instead. -->
		<DocsNavNode info={tree.index} />
	{/if}

	{#each tree.nodes as node}
		{#if is_tree(node)}
			<!-- Recursion here is fine. We are not dealing with a tree the size of a linux root file system. -->
			<svelte:self tree={node} nested={nested + 1} />
		{:else}
			<DocsNavNode info={assert_is_info_node(node)} />
		{/if}
	{/each}
</ul>

<style>
	ul {
		padding-left: 1rem;
	}
</style>
