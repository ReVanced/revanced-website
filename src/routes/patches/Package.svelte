<script lang="ts">
	import { goto } from '$app/navigation';

	export let selectedPkg: string | null;
	export let name: string;
	export let searchTerm: string | null;

	function handleClick() {
		// Assign the selected package. If it's already selected, deselect it.
		const url = new URL(window.location.href);
		const params = new URLSearchParams();
		url.pathname = '/patches';

		if (selectedPkg !== name && name !== 'All packages') {
			params.set('pkg', name);
		}
		if (searchTerm) {
			params.set('s', searchTerm);
		}
		url.search = params.toString();
		goto(url.pathname + url.search);

		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="package"
	class:selected={selectedPkg === name || (name === 'All packages' && !selectedPkg)}
	on:click={handleClick}
>
	{name}
</div>

<style lang="scss">
	.package {
		padding: 0.75rem 1rem;
		border-radius: 100px;

		font-size: 0.85rem;
		font-weight: 500;
		color: var(--text-four);

		cursor: pointer;
		user-select: none;
		transition:
			background-color 0.4s var(--bezier-one),
			color 0.3s var(--bezier-one);

		@media (max-width: 768px) {
			border-radius: 0px;
			font-size: 0.9rem;
			padding: 1rem;
			word-break: break-all;
			overflow: hidden;
			text-overflow: ellipsis;
			border-bottom: 1px solid var(--border);
		}

		&.selected {
			color: var(--primary);
			background-color: var(--tertiary);
		}

		&:hover:not(.selected) {
			background-color: var(--surface-seven);
			color: var(--text-one);
		}
	}
</style>
