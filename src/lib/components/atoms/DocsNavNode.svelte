<script lang="ts">
  import type { DocumentInfo } from '$lib/documentation.shared';
  export let info: DocumentInfo;
</script>

<!-- Always part of a list -->
<li>
  <div class="doc-section">
    <a href="/docs/{info.slug}">{info.title}</a>
  </div>
</li>

<style>
a {
  text-decoration: none;
  background-color: inherit;
  color: var(--white);
}

.doc-section {
	background-color: var(--grey-one);
	border-radius: 12px;
	padding: 15px 20px;
}

li {
  padding-bottom: 0.5rem;
}
</style>
