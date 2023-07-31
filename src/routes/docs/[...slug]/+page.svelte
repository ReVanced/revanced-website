<script lang="ts">
	import Meta from '$lib/components/Meta.svelte';
	import type { PageData } from './$types';

	import '../documentation.scss';

	// Data here comes from a trusted source.
	// CSS comes from the layout.
	export let data: PageData;
</script>

<Meta title="Docs" />

<div id="markup-content">
	<h1 class="title">{data.title}</h1>
	{@html data.content}
</div>
