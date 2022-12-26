<script lang="ts">
	export let selectedPkg: string | boolean;
	export let name: string;

	function handleClick() {
		// Assign the selected package, if already selected, make it false
		if (selectedPkg === name || name === 'All packages') {
			selectedPkg = false;
		} else {
			selectedPkg = name;
		}
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
		color: var(--grey-five);
		transition: color 0.3s var(--bezier-one);
	}

	.selected {
		color: var(--accent-color);
		transition: color 0.3s var(--bezier-one);
		background-color: var(--accent-low-opacity);
	}
	.package:hover:not(.selected) {
		background-color: var(--grey-six);
	}

	.package:not(.selected):hover {
		color: var(--white);
	}

	@media (max-width: 768px) {
		.package {
			border-radius: 0px;
			font-size: 0.9rem;
			padding: 1rem 1rem;
			width: 100%;
			background-color: transparent;
			word-break: break-all;
			overflow: hidden;
			text-overflow: ellipsis;
			color: var(--grey-five);
			border-bottom: 1px solid var(--grey-three);
		}

		.selected {
			color: var(--accent-color);
			background-color: var(--accent-low-opacity);
		}

		.package:not(.selected):hover {
			color: var(--grey-five);
		}
	}
</style>
