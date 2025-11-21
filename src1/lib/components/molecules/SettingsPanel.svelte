<script lang="ts">
  import { getApiBaseUrl, setApiBaseUrl, resetSettings, getAllowAnalytics, setAllowAnalytics } from '$lib/config/settings';

  let apiUrl = $state(getApiBaseUrl());
  let allowAnalytics = $state(getAllowAnalytics());

  function save() {
    setApiBaseUrl(apiUrl.trim());
    setAllowAnalytics(allowAnalytics);
  }

  function reset() {
    resetSettings();
    apiUrl = getApiBaseUrl();
    allowAnalytics = getAllowAnalytics();
  }
</script>

<div class="settings-grid">
  <div class="field">
    <label for="api-url">API base URL</label>
    <input id="api-url" type="url" bind:value={apiUrl} placeholder="https://api.revanced.app" />
    <p class="hint">Used for fetching announcements, contributors, patches, etc.</p>
  </div>

  <div class="field row">
    <input id="analytics" type="checkbox" bind:checked={allowAnalytics} />
    <label for="analytics">Allow anonymous analytics</label>
  </div>

  <div class="actions">
    <button class="btn" type="button" onclick={save}>Save</button>
    <button class="btn text" type="button" onclick={reset}>Reset</button>
  </div>
</div>

<style>
  .settings-grid { display: grid; gap: var(--space-4); max-width: 640px; }
  .field { display: grid; gap: var(--space-2); }
  .field.row { grid-auto-flow: column; grid-auto-columns: max-content; align-items: center; gap: var(--space-3); }
  label { font-size: var(--font-size-sm); color: var(--color-text-muted); }
  input[type="url"] { padding: var(--space-2) var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-2); background: var(--color-bg); color: var(--color-text); }
  input[type="checkbox"] { width: 1rem; height: 1rem; }
  .hint { font-size: var(--font-size-xs); color: var(--color-text-muted); }
  .actions { display: flex; gap: var(--space-3); }
  .btn { padding: var(--btn-padding-y) var(--btn-padding-x); border-radius: var(--btn-radius); background: var(--color-accent); color: white; }
  .btn.text { background: transparent; color: var(--color-text); border: 1px solid var(--color-border); }
  .btn:hover { filter: brightness(0.95); }
</style>
