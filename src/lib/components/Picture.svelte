<script lang="ts">
  // See: https://github.com/JonasKruckenberg/imagetools/blob/main/docs/directives.md#picture
  import type { Picture } from 'vite-imagetools';
  export let data: Picture;
  export let alt: string;
</script>

<picture>
  {#each Object.entries(data.sources) as [format, images]}
    <source srcset={images.map(img => `${img.src} ${img.w}w`).join(", ")} type="image/{format}">
  {/each}
  <img {alt} src={data.fallback.src} />
</picture>
