<script lang="ts">
	// See: https://github.com/JonasKruckenberg/imagetools/blob/main/docs/directives.md#picture
	import type { Picture } from 'vite-imagetools';

	let {
		data,
		alt
	}: {
		data: Picture;
		alt: string;
	} = $props();
</script>

<picture>
	{#each Object.entries(data.sources) as [format, srcset]}
		<source {srcset} type="image/{format}" />
	{/each}
	<img {alt} src={data.img.src} />
</picture>
