<script>
  // See: https://github.com/JonasKruckenberg/imagetools/blob/main/docs/directives.md#picture
  export let data;
  export let alt;
</script>

<picture>
  {#each Object.entries(data.sources) as [format, images]}
    <source srcset={images.map(img => `${img.src} ${img.w}w`).join(", ")} type="image/{format}">
  {/each}
  <img {alt} src={data.fallback.src} />
</picture>
