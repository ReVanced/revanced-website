<script lang="ts">
	// See: https://github.com/JonasKruckenberg/imagetools/blob/main/docs/directives.md#picture
	import type { Picture } from 'vite-imagetools';
	export let data: Picture;
	export let alt: string;
</script>

{#if data && data.sources}
	<picture>
		{#each Object.entries(data.sources) as [format, srcset]}
			<source {srcset} type="image/{format}" />
		{/each}
		<img {alt} src={data.img.src} />
	</picture>
{:else}
	<!-- Fallback during SSR -->
	<img {alt} src="" />
{/if}
