<script lang="ts">
  import type { WithChildren } from '$types';

  type Props = {
    description?: string;
    titleSuffix?: string; // optional custom suffix after base title
  } & WithChildren;

  const SITE_NAME = 'ReVanced';

  let { description, titleSuffix, children }: Props = $props();

  let pageTitle = $derived(
    [SITE_NAME, titleSuffix || description]
      .filter(Boolean)
      .join(' - ')
      .trim()
  );

  let metaDescription = $derived(description || 'ReVanced community project.');
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={metaDescription} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={metaDescription} />
  <meta property="og:type" content="website" />
</svelte:head>

<main class="page-shell" aria-labelledby="page-heading">
  {@render children()}
</main>

<style>
  .page-shell {
    width: 100%;
    margin: 0 auto;
    padding: var(--space-6) var(--space-6) var(--space-10);
    max-width: 1080px;
  }
  @media (max-width: 760px) {
    .page-shell { padding: var(--space-5) var(--space-4) var(--space-8); }
  }
</style>