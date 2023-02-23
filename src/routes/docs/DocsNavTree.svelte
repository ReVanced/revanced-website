<script lang="ts">
	import { is_tree, type DocsTreeNode } from './documentation.shared';
	import type { DocsTree, DocumentInfo } from './documentation.shared';

	import DocsNavNode from './DocsNavNode.svelte';

	export let tree: DocsTree;
	// How deeply nested this is.
	export let nested = 0;

  function assert_info_node(v: DocsTreeNode) {
    if (!is_tree(v)) {
      throw new Error("not tree aaa");
    }
    return v as DocumentInfo;
  }
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
			<DocsNavNode info={assert_info_node(node)} />
		{/if}
	{/each}
</ul>

<style>
	ul {
		padding-left: 1rem;
	}
</style>
