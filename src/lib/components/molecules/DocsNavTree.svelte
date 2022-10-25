<script lang="ts">
  import { is_tree } from '$lib/documentation.shared';
  import type { DocsTree } from '$lib/documentation.shared';

  import DocsNavNode from '$lib/components/atoms/DocsNavNode.svelte';

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
      <DocsNavNode info={node} />
    {/if}
  {/each}
</ul>

<style>
ul {
	padding-left: 2rem;
  list-style-type: "• ";
  color: var(--white);
}
</style>
