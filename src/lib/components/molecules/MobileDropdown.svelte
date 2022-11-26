<script>
import { slide } from 'svelte/transition';
</script>

<div transition:slide>
  <slot />
</div>

<style>
  div {
    position: fixed;
    width: 100vw;
    top: 70px;
    z-index: 999;
    background-color: var(--grey-seven);
  }
</style>
