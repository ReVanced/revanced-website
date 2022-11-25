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
    top: 75px;

    z-index: 999;
    /* background-color: var(--grey-six); guh @xafn */
    background-color: hsla(220, 12%, 15%, 0.95);
    border-style: solid;
    border-color: var(--accent-color);

    /* its rotated for some reason :skull: */
    border-left: 0.5rem;
    border-right: 0.5rem;
  }
</style>
