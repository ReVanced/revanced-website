<script lang="ts">
  import type { PageData } from './$types';

  import '$lib/documentation.scss';


  // Data here comes from a trusted source.
  // CSS comes from the layout.
  export let data: PageData;
</script>

<svelte:head>
	<title>ReVanced | Docs</title>
	<meta content="ReVanced | Docs" name="og:title" />
	<meta content="ReVanced | Docs" name="twitter:title" />
</svelte:head>

<div id="markup-content">
  <h2 class="title">{data.title}</h2>

  {@html data.content}
</div>

<style>
  h2 {
    color: var(--white);
    line-height: 1.6;
  }
</style>