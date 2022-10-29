<script lang="ts">
  import * as settings from '../../data/api/settings';
  import { clear } from '../../data/api/cache';

  let url = settings.api_base_url();

  function handler() {
    clear();
    settings.set_api_base_url(url);
    location.reload(true);
  }
</script>

<section class="settings">
  <input name="api-url" type="text" bind:value={url} />
  <button on:click={handler}>Save</button>
</section>
<section class="cache">
  <button on:click={clear}>Clear cache</button>
</section>

<style>
  .settings {
    padding-top: 5rem;
  }
</style>
