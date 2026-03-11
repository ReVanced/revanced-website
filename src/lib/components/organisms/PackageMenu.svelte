<script lang="ts">
	import type { WithOptionalChildren } from '$types';

	type Props = WithOptionalChildren;

	let { children }: Props = $props();
</script>

<div class="package-menu">
	<h6>Packages</h6>
	<hr />
	<div class="packages">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>

<style>
	.package-menu {
		display: flex;
		flex-direction: column;
		position: sticky;
		height: calc(100vh - 60px);
		top: 60px;
		padding: calc(6rem - 60px) 30px 30px 10px;
		overflow-y: auto;
	}

	.package-menu::-webkit-scrollbar-thumb {
		background-color: transparent;
	}

	.package-menu:hover::-webkit-scrollbar-thumb {
		background-color: var(--primary);
	}

	h6 {
		margin-bottom: 1rem;
		color: var(--primary);
	}

	hr {
		border: none;
		border-top: 1px solid var(--border);
		margin: 0;
	}

	.packages {
		margin-top: 0.75rem;
		word-break: break-all;
	}
</style>
