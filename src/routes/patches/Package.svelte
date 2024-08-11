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
<div
	class="package"
	class:selected={selectedPkg === name || (name === 'All packages' && !selectedPkg)}
	on:click={handleClick}
>
	{name}
</div>

<style>
	.package {
		padding: 0.75rem 1rem;
		font-size: 0.85rem;
		font-weight: 500;
		border-radius: 100px;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.6rem;
		width: 100%;
		user-select: none;
		transition: background-color 0.4s var(--bezier-one);
		color: var(--text-four);
		transition: color 0.3s var(--bezier-one);
	}

	.selected {
		color: var(--primary);
		transition: color 0.3s var(--bezier-one);
		background-color: var(--tertiary);
	}
	.package:hover:not(.selected) {
		background-color: var(--surface-seven);
	}

	.package:not(.selected):hover {
		color: var(--text-one);
	}

	@media (max-width: 767px) {
		.package {
			border-radius: 0px;
			font-size: 0.9rem;
			padding: 1rem 1rem;
			width: 100%;
			background-color: transparent;
			word-break: break-all;
			overflow: hidden;
			text-overflow: ellipsis;
			color: var(--text-four);
			border-bottom: 1px solid var(--border);
		}

		.selected {
			color: var(--primary);
			background-color: var(--tertiary);
		}

		.package:not(.selected):hover {
			color: var(--text-four);
		}
	}
</style>
