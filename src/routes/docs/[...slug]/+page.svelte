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
  <h1 class="title">{data.title}</h1>

  {@html data.content}
</div>
