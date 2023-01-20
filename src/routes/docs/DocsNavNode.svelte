<script lang="ts">
	import type { DocumentInfo } from './documentation.shared';
	export let info: DocumentInfo;
	import { page } from '$app/stores';
</script>

<!-- Always part of a list -->
<li>
	<a href="/docs/{info.slug}">
		<div class="doc-section item" class:selected={$page.url.pathname === `/docs/${info.slug}`}>
			<h5>{info.title}</h5>
		</div>
	</a>
</li>

<style>
	a {
		text-decoration: none;
	}

	li {
		list-style: none;
	}
	.item {
		padding: 0.6rem 1rem;
		border-radius: 8px;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.6rem;
		width: 100%;
		user-select: none;
		--webkit-user-select: none;
		transition: background-color 0.4s var(--bezier-one);
	}

	.item h5 {
		color: var(--grey-five);
		transition: color 0.3s var(--bezier-one);
	}

	.selected h5 {
		color: var(--grey-four);
		transition: color 0.3s var(--bezier-one);
	}

	.selected {
		background-color: var(--accent-color);
	}
	.item:hover:not(.selected) {
		background-color: var(--grey-six);
	}

	.item:not(.selected):hover h5 {
		color: var(--white);
	}
</style>
