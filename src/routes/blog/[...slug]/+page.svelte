<script>
export let data;
</script>

<svelte:head>
	<title>ReVanced | {data.post.title}</title>
	<meta content="ReVanced | {data.post.title}" name="og:title" />
	<meta content="ReVanced | {data.post.title}" name="twitter:title" />
</svelte:head>
<h1 style="color: var(--accent-color); font-size: 5rem;">
  {data.post.title}
</h1>

{@html data.post.content}
